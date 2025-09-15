'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuthSession } from '@/hooks/useAuthSession'
import useCredits from '@/hooks/useCredits'

interface ProfileOverlayProps {
  open: boolean
  onClose: () => void
}

export function ProfileOverlay({ open, onClose }: ProfileOverlayProps) {
  const { user, signOut } = useAuthSession()
  const userId = user?.id
  const { credits, loading } = useCredits(userId)

  const initials = useMemo(() => {
    const email = user?.email || ''
    return email.slice(0, 2).toUpperCase() || 'U'
  }, [user])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            className="relative mx-4 w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/60 shadow-xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black text-white grid place-items-center cursor-interactive"
              data-cursor-hover
            >
              ✕
              <div data-cursor-bounds className="absolute inset-0 rounded-full" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-900 text-white grid place-items-center text-sm font-semibold">
                  {initials}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-base">{user?.user_metadata?.name || 'User'}</div>
                  <div className="text-gray-600 text-sm">{user?.email}</div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-600">Remaining credits</div>
                <div className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? '—' : credits ?? 0}
                </div>
                <div className="mt-2 text-xs text-gray-500">1 credit = 1 try-on</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-11 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition active:scale-95 cursor-interactive"
                  data-cursor-hover
                >
                  Close
                  <div data-cursor-bounds className="absolute inset-0 rounded-full" />
                </button>
                <button
                  onClick={async () => {
                    await signOut()
                    onClose()
                  }}
                  className="flex-1 h-11 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition active:scale-95 cursor-interactive"
                  data-cursor-hover
                >
                  Sign out
                  <div data-cursor-bounds className="absolute inset-0 rounded-full" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileOverlay


