import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req as unknown as Request)
}

export async function GET(req: NextRequest) {
  const headers = buildCorsHeaders(req as unknown as Request)

  const auth = req.headers.get('authorization') || ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : null
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401, headers })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return new NextResponse('Unauthorized', { status: 401, headers })
  }

  return NextResponse.json(
    { userId: data.user.id, email: data.user.email },
    { status: 200, headers }
  )
}


