import { NextRequest, NextResponse } from 'next/server'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

function clearCookie(name: string) {
  return `${name}=; Path=/; Max-Age=0; SameSite=None; Secure; HttpOnly`
}

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = new Headers(buildCorsHeaders(req as unknown as Request))
  headers.append('Set-Cookie', clearCookie('sb_at'))
  headers.append('Set-Cookie', clearCookie('sb_rt'))
  return NextResponse.json({ ok: true }, { headers })
}


