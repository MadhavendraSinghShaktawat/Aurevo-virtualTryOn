import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders } from '@/lib/cors'

export async function GET(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400, headers })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, anonKey)

    // Supabase JS accepts provider tokens via signInWithIdToken for Google
    // Here we rely on the auth callback URL handling. If needed, you could
    // exchange the code at Google directly; Supabase hosted flow is simpler.
    // For extensions, we pass the full callback URL back to the extension
    // to let it parse tokens from the hash/fragment.

    return NextResponse.json({ ok: true }, { headers })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500, headers })
  }
}


