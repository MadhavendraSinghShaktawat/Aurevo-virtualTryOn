import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const extensionId = url.searchParams.get('extension_id') || process.env.EXTENSION_ID || ''
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  if (!extensionId || !supabaseUrl) {
    return NextResponse.json({ error: 'Missing extension_id or Supabase URL' }, { status: 400 })
  }

  // Chrome extensions use the chromiumapp redirect domain
  const redirectTo = `https://${extensionId}.chromiumapp.org/`
  const authorize = new URL(`${supabaseUrl}/auth/v1/authorize`)
  authorize.searchParams.set('provider', 'google')
  authorize.searchParams.set('redirect_to', redirectTo)
  // Optional scopes example
  // authorize.searchParams.set('scopes', 'email profile openid')

  return NextResponse.redirect(authorize.toString(), { status: 302 })
}


