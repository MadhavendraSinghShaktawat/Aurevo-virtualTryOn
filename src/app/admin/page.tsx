import Link from 'next/link'
import { headers, cookies } from 'next/headers'

async function getMe() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || 'http'
  const base = `${proto}://${host}`
  const c = await cookies()
  const cookieStr = c.toString()
  const res = await fetch(`${base}/api/admin/me`, {
    cache: 'no-store',
    headers: { cookie: cookieStr }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function AdminDashboard() {
  const me = await getMe()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center">A</div>
          <span className="font-semibold text-slate-900">Aurevo Admin</span>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100">Logout</button>
        </form>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6 p-6">
        <aside className="bg-white rounded-xl border border-slate-200 p-4">
          <nav className="space-y-1">
            <Link href="/admin" className="block px-3 py-2 rounded-md bg-slate-900 text-white">Overview</Link>
            <a className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100" href="#">Users</a>
            <a className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100" href="#">Credits</a>
            <a className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100" href="#">Logs</a>
          </nav>
        </aside>

        <main className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Welcome</h2>
            <div className="text-slate-600">Logged in as <b>{me?.username || 'admin'}</b></div>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500">Total Users</div>
              <div className="mt-2 text-2xl font-semibold">—</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500">Total Credits</div>
              <div className="mt-2 text-2xl font-semibold">—</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500">Today Requests</div>
              <div className="mt-2 text-2xl font-semibold">—</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}


