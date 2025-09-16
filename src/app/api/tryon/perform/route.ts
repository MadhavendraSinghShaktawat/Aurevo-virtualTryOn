// Combined endpoint: isolates product then applies try-on in one server call
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  try {
    const raw = await req.text().catch(() => '')
    if (!raw) return NextResponse.json({ error: 'Missing body' }, { status: 400, headers })
    let body: any
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers }) }
    const { userImageUrl, productImageUrl, productType, fitInstructions } = body || {}
    if (!userImageUrl || !productImageUrl || !productType) {
      return NextResponse.json({ error: 'userImageUrl, productImageUrl, productType are required' }, { status: 400, headers })
    }

    // Step 1: isolate
    const isoRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/product/isolate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Cookies not required for isolate; pass through auth if provided
      body: JSON.stringify({ imageUrl: productImageUrl, productType })
    })
    const isoJson = await isoRes.json()
    if (!isoRes.ok || !isoJson?.ok) {
      return NextResponse.json({ ok: false, error: isoJson?.error || 'Isolation failed' }, { status: isoRes.status || 500, headers })
    }

    // Step 2: apply (credits/auth enforced inside)
    const authHeader = req.headers.get('authorization') || ''
    const cookieHeader = req.headers.get('cookie') || ''
    const applyRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tryon/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({
        userImageUrl,
        productImageUrl: isoJson.isolatedImage,
        productType,
        fitInstructions,
      })
    })
    const applyJson = await applyRes.json()
    return NextResponse.json(applyJson, { status: applyRes.status, headers })

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}


