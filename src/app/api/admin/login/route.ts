import { NextRequest, NextResponse } from 'next/server'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { ADMIN_COOKIE, createAdminJWT, validateAdminCredentials } from '@/lib/admin-auth'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  const body = await req.json().catch(() => ({})) as { username?: string; password?: string }
  const { username = '', password = '' } = body
  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401, headers })
  }

  const token = await createAdminJWT({ sub: 'admin', username })
  const h = new Headers(headers)
  h.append('Set-Cookie', `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax; Secure; HttpOnly`)
  return NextResponse.json({ ok: true }, { headers: Object.fromEntries(h.entries()) })
}


