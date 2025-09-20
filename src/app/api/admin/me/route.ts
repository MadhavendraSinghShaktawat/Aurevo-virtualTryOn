import { NextRequest, NextResponse } from 'next/server'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { ADMIN_COOKIE, verifyAdminJWT } from '@/lib/admin-auth'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function GET(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  const cookie = req.headers.get('cookie') || ''
  const token = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(`${ADMIN_COOKIE}=`))?.split('=')[1]
  const payload = await verifyAdminJWT(token ? decodeURIComponent(token) : undefined)
  if (!payload) return NextResponse.json({ ok: false }, { status: 401, headers })
  return NextResponse.json({ ok: true, username: payload.username }, { headers })
}


