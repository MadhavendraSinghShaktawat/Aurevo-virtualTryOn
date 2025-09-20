import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyAdminJWT } from '@/lib/admin-auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const cookie = req.headers.get('cookie') || ''
    const token = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(`${ADMIN_COOKIE}=`))?.split('=')[1]
    const payload = await verifyAdminJWT(token ? decodeURIComponent(token) : undefined)
    if (!payload) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}


