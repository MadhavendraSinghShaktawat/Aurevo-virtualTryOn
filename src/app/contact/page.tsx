'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Contact aurevo</h1>
        <p className="text-gray-600 mb-10">We usually respond within one business day.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            {status === 'sent' ? (
              <div className="text-green-700 font-medium">Thanks! Your message has been sent.</div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={6} required className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="rounded-full bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors" type="submit">Send</button>
              </form>
            )}
          </section>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-2">Company</h2>
              <p className="text-gray-700">aurevo</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-2">Email</h2>
              <a href="mailto:hello@aurevo.co" className="text-blue-600 hover:underline">hello@aurevo.co</a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}


