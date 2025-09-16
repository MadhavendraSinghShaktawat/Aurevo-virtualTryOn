import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function GET(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  const rawCookie = req.headers.get('cookie') || ''
  const cookiePairs = rawCookie
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const idx = s.indexOf('=')
      const key = idx === -1 ? s : s.slice(0, idx)
      const val = idx === -1 ? '' : decodeURIComponent(s.slice(idx + 1))
      return [key, val] as [string, string]
    })
  const map = new Map<string, string>(cookiePairs)
  const accessToken = map.get('sb_at') as string | undefined
  const refreshToken = map.get('sb_rt') as string | undefined

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  async function getUserWithToken(token: string) {
    const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
    return client.auth.getUser()
  }

  if (accessToken) {
    const { data, error } = await getUserWithToken(accessToken as string)
    if (data?.user && !error) {
      return NextResponse.json({ userId: data.user.id, email: data.user.email }, { status: 200, headers })
    }
  }

  // Try refresh
  if (refreshToken) {
    const supabase = createClient(supabaseUrl, anonKey)
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken as string })
    if (data?.session && !error) {
      const h = new Headers(headers)
      const useSecure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
      const secureAttr = useSecure ? ' Secure;' : ''
      h.append('Set-Cookie', `sb_at=${encodeURIComponent(data.session.access_token)}; Path=/; Max-Age=3600; SameSite=None;${secureAttr} HttpOnly`)
      const u = data.session.user
      return NextResponse.json({ userId: u.id, email: u.email }, { status: 200, headers: h })
    }
  }

  return new NextResponse('Unauthorized', { status: 401, headers })
}


