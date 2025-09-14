'use client'

import { useEffect } from 'react'
import { initializeEnvironment } from '@/lib/env'

/**
 * Client-side environment checker component
 * This runs only in the browser, not during build time
 */
export function EnvironmentChecker() {
  useEffect(() => {
    // Initialize environment validation on the client side
    initializeEnvironment()
  }, [])

  return null // This component doesn't render anything
}
