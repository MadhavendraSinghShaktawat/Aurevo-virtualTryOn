// Combined endpoint for Style Replicator: isolate multiple garments from a reference image
// then apply sequentially onto the user photo (top -> bottom -> shoes/accessories)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'
import sharp from 'sharp'

type IncludeFlags = { top?: boolean; bottom?: boolean; shoesAccessories?: boolean }

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

    const { userImageUrl, referenceImageUrl, include, fitInstructions } = body || {}
    if (!userImageUrl || !referenceImageUrl) {
      return NextResponse.json({ error: 'userImageUrl and referenceImageUrl are required' }, { status: 400, headers })
    }
    const inc: IncludeFlags = {
      top: include?.top !== false,
      bottom: include?.bottom !== false,
      shoesAccessories: include?.shoesAccessories !== false,
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Step 1: isolate requested parts in parallel
    const isoTasks: Array<Promise<Response>> = []
    const isoKinds: string[] = []
    if (inc.top) { isoKinds.push('tshirt'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: referenceImageUrl, productType: 'tshirt' }) })) }
    if (inc.bottom) { isoKinds.push('pants'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: referenceImageUrl, productType: 'pants' }) })) }
    if (inc.shoesAccessories) {
      isoKinds.push('shoes'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: referenceImageUrl, productType: 'shoes' }) }))
      isoKinds.push('accessories'); isoTasks.push(fetch(`${baseUrl}/api/product/isolate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: referenceImageUrl, productType: 'accessories' }) }))
    }

    const isoResults = await Promise.all(isoTasks)
    const isoJsons = await Promise.all(isoResults.map(r => r.json()))
    const kindToImage: Record<string, string | undefined> = {}
    isoJsons.forEach((j, i) => {
      if (j?.ok) kindToImage[isoKinds[i]] = j.isolatedImage
    })

    // Prepare a composite for shoes+accessories (if both present)
    let shoesAccessoriesImage: string | undefined
    if (inc.shoesAccessories) {
      const shoes = kindToImage['shoes']
      const acc = kindToImage['accessories']
      if (shoes && acc) {
        try {
          const sBuf = Buffer.from(shoes.split(',')[1] || '', 'base64')
          const aBuf = Buffer.from(acc.split(',')[1] || '', 'base64')
          // place side-by-side on a white canvas so the model can see both
          const sMeta = await sharp(sBuf).metadata()
          const aMeta = await sharp(aBuf).metadata()
          const h = Math.max(sMeta.height || 512, aMeta.height || 512)
          const w = (sMeta.width || 512) + (aMeta.width || 512)
          const canvas = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 255, g: 255, b: 255 } } })
            .composite([
              { input: sBuf, top: 0, left: 0 },
              { input: aBuf, top: 0, left: sMeta.width || 512 },
            ])
            .jpeg({ quality: 95 })
            .toBuffer()
          shoesAccessoriesImage = `data:image/jpeg;base64,${canvas.toString('base64')}`
        } catch {
          shoesAccessoriesImage = shoes || acc
        }
      } else {
        shoesAccessoriesImage = shoes || acc
      }
    }

    // Step 2: apply sequentially (each apply consumes 1 credit; total 3 when all enabled)
    const authHeader = req.headers.get('authorization') || ''
    const cookieHeader = req.headers.get('cookie') || ''

    let currentImage = userImageUrl as string
    const applyOnce = async (productImageUrl: string, productType: 'tshirt'|'pants'|'shoes'|'accessories') => {
      const res = await fetch(`${baseUrl}/api/tryon/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify({ userImageUrl: currentImage, productImageUrl, productType, fitInstructions })
      })
      const js = await res.json()
      if (!res.ok || !js?.ok) throw new Error(js?.error || 'Try-on failed')
      currentImage = js.tryOnImage
    }

    if (inc.top && kindToImage['tshirt']) await applyOnce(kindToImage['tshirt'] as string, 'tshirt')
    if (inc.bottom && kindToImage['pants']) await applyOnce(kindToImage['pants'] as string, 'pants')
    if (inc.shoesAccessories && shoesAccessoriesImage) {
      // Use 'shoes' as the placement hint; instructions can mention accessories
      await applyOnce(shoesAccessoriesImage, 'shoes')
    }

    return NextResponse.json({ ok: true, finalImage: currentImage, isolated: { top: kindToImage['tshirt'], bottom: kindToImage['pants'], shoesAccessories: shoesAccessoriesImage } }, { headers })

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}


