'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useCredits(userId?: string) {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (!userId) { setCredits(null); setLoading(false); return }
      setLoading(true)
      // Lazily ensure monthly top-up before reading credits
      await supabase.rpc('ensure_monthly_topup', { p_user_id: userId })
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .maybeSingle()
      if (!active) return
      if (error) { setLoading(false); return }
      setCredits(data?.credits ?? 0)
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [userId])

  return { credits, loading }
}

export default useCredits


