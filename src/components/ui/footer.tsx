'use client'

import { useEffect, useRef } from 'react'

export function Footer() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return
    const curveEl = pathRef.current
    const defaultCurveValue = 350
    const curveRate = 3
    let ticking = false

    const onScroll = () => {
      const scrollPos = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (scrollPos >= 0 && scrollPos < defaultCurveValue) {
            const curveValue = defaultCurveValue - parseFloat(String(scrollPos / curveRate))
            curveEl.setAttribute('d', `M 800 300 Q 400 ${curveValue} 0 300 L 0 0 L 800 0 L 800 300 Z`)
          }
          ticking = false
        })
      }
      ticking = true
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="relative mt-0">
      {/* Curve animation (kept) */}
      <div className="relative w-full overflow-hidden" aria-hidden>
        <svg viewBox="0 0 800 300" className="w-full block h-16 sm:h-20 md:h-24" preserveAspectRatio="none">
          <path ref={pathRef} id="curve" fill="#f3f4f6" d="M 800 300 Q 400 350 0 300 L 0 0 L 800 0 L 800 300 Z" />
        </svg>
      </div>

      {/* Themed footer content */}
      <div className="bg-gray-50 text-gray-900 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="flex items-start">
              <div className="text-2xl font-extrabold tracking-tight">aurevo</div>
            </div>

            {/* The Good */}
            <nav aria-label="Footer – The Good">
              <div className="text-sm font-semibold text-gray-600 mb-4">The Good</div>
              <ul className="space-y-3 text-gray-700">
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="#">Home</a></li>
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="#pricing">Pricing</a></li>
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="/contact">Contact</a></li>
              </ul>
            </nav>

            {/* The Boring */}
            <nav aria-label="Footer – The Boring">
              <div className="text-sm font-semibold text-gray-600 mb-4">The Boring</div>
              <ul className="space-y-3 text-gray-700">
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="#">Terms</a></li>
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="/privacy">Privacy</a></li>
              </ul>
            </nav>

            {/* The Cool */}
            <nav aria-label="Footer – The Cool">
              <div className="text-sm font-semibold text-gray-600 mb-4">The Cool</div>
              <ul className="space-y-3 text-gray-700">
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="https://x.com" target="_blank" rel="noreferrer">X</a></li>
                <li><a data-cursor-hover className="hover:text-gray-900 transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              </ul>
            </nav>
          </div>

          <div className="mt-10 text-xs text-gray-500">© {new Date().getFullYear()} aurevo. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


