import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  try {
    const { refresh_token } = await req.json()
    if (!refresh_token) {
      return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400, headers })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, anonKey)

    const { data, error } = await supabase.auth.refreshSession({ refresh_token })
    if (error || !data.session) {
      return NextResponse.json({ error: error?.message || 'Refresh failed' }, { status: 401, headers })
    }

    const { access_token, refresh_token: newRefresh } = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }

    return NextResponse.json({ access_token, refresh_token: newRefresh }, { headers })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}


