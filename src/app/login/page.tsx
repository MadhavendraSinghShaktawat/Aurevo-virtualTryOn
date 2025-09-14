'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Redirect URI must be whitelisted in Supabase → Auth → URL Configuration → Site URL / Additional Redirect URLs
const getRedirectTo = () => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  if (envUrl) return envUrl.endsWith('/') ? envUrl : `${envUrl}/`
  return typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const toggle = () => setShowPassword((s) => !s)

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: getRedirectTo() } })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <a href="/" className="inline-flex items-center gap-2 text-gray-700 font-semibold cursor-interactive" data-cursor-hover>
          <div className="h-8 w-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">a</div>
          aurevo
        </a>
      </div>

      <div className="flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 shadow-xl bg-white/80 backdrop-blur-md p-6 sm:p-8">
          <div className="mx-auto -mt-12 mb-4 h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg">→</div>
          <h1 className="text-xl font-semibold text-gray-900 text-center">Sign in with email</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Make a new doc to bring your words, data, and teams together. For free</p>

          <form className="mt-6 space-y-4">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-3 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-400">✉</span>
                <input type="email" placeholder="Email" className="w-full outline-none" />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-3 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-400">•</span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full outline-none" />
                <button type="button" onClick={toggle} className="text-gray-400 hover:text-gray-600 cursor-interactive" data-cursor-hover>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <div />
              <a href="#" className="text-gray-600 hover:text-gray-800 cursor-interactive" data-cursor-hover>Forgot password?</a>
            </div>

            <button className="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold shadow-lg hover:bg-black/90 active:scale-[.99] transition-all cursor-interactive" data-cursor-hover>
              Get Started
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">or sign in with</div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <button onClick={signInWithGoogle} className="rounded-xl border bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95 transition cursor-interactive" data-cursor-hover>
              G
            </button>
            <button className="rounded-xl border bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95 transition cursor-interactive" data-cursor-hover>
              F
            </button>
            <button className="rounded-xl border bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95 transition cursor-interactive" data-cursor-hover>
              
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}


