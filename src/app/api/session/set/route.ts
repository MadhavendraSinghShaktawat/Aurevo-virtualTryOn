import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

function cookie(name: string, value: string, maxAgeSec: number) {
  const useSecure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
  const secureAttr = useSecure ? ' Secure;' : ''
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=None;${secureAttr} HttpOnly`
}

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = new Headers(buildCorsHeaders(req as unknown as Request))
  try {
    const { access_token, refresh_token } = await req.json()
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400, headers })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${access_token}` } },
    })
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401, headers })
    }

    // Set cookies: short for AT (~1h), longer for RT (~1 month)
    headers.append('Set-Cookie', cookie('sb_at', access_token, 60 * 60))
    headers.append('Set-Cookie', cookie('sb_rt', refresh_token, 60 * 60 * 24 * 30))

    return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } }, { status: 200, headers })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}


