'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Keeps HttpOnly session cookies (sb_at/sb_rt) in sync after website login/logout.
 * - On mount: reads current Supabase session and POSTs tokens to /api/session/set
 * - On auth state change: re-syncs or clears cookies
 */
export default function SessionSync() {
  const syncing = useRef(false)

  useEffect(() => {
    let mounted = true

    async function syncNow() {
      if (syncing.current) return
      syncing.current = true
      try {
        const { data } = await supabase.auth.getSession()
        const at = data.session?.access_token
        const rt = data.session?.refresh_token
        if (at && rt) {
          await fetch('/api/session/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ access_token: at, refresh_token: rt }),
          })
        }
      } catch { /* ignore */ }
      finally {
        syncing.current = false
      }
    }

    // initial sync
    syncNow()

    // react to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      syncNow()
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return null
}


