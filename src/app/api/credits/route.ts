import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function GET(req: NextRequest) {
  let headers = buildCorsHeaders(req as unknown as Request)
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

  let client = createClient(supabaseUrl, anonKey)
  let userId: string | null = null

  async function getUserIdFromToken(token: string) {
    const c = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
    const { data } = await c.auth.getUser()
    return data?.user?.id || null
  }

  if (accessToken) {
    userId = await getUserIdFromToken(accessToken as string)
  }
  if (!userId && refreshToken) {
    const { data } = await client.auth.refreshSession({ refresh_token: refreshToken as string })
    if (data?.session) {
      const h = new Headers(headers)
      h.append('Set-Cookie', `sb_at=${encodeURIComponent(data.session.access_token)}; Path=/; Max-Age=3600; SameSite=None; Secure; HttpOnly`)
      userId = data.session.user.id
      // replace headers object with one that includes Set-Cookie
      headers = Object.fromEntries(h.entries())
    }
  }

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401, headers })
  }

  const db = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${accessToken || ''}` } } })
  // Ensure monthly top-up and return the RPC value directly to avoid RLS read issues
  const { data: topupValue, error: rpcError } = await db.rpc('ensure_monthly_topup', { p_user_id: userId })
  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500, headers })
  }
  return NextResponse.json({ credits: typeof topupValue === 'number' ? topupValue : 0 }, { status: 200, headers })
}


