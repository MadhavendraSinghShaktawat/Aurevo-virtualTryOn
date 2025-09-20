import { NextRequest, NextResponse } from 'next/server'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  const h = new Headers(headers)
  h.append('Set-Cookie', `${ADMIN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Secure; HttpOnly`)
  return NextResponse.json({ ok: true }, { headers: Object.fromEntries(h.entries()) })
}


