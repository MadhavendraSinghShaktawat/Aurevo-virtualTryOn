'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SolutionHighlightsProps { className?: string }

const items = [
  { primary: 'Try outfits', secondary: 'instantly' },
  { primary: 'See perfect', secondary: 'fit' },
  { primary: 'Shop with', secondary: 'confidence' },
  { primary: 'No more', secondary: 'returns' },
]

export function SolutionHighlights({ className = '' }: SolutionHighlightsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.utils.toArray<HTMLElement>(containerRef.current.querySelectorAll('[data-text]')).forEach((el) => {
      gsap.to(el, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'center 80%',
          end: 'center 20%',
          scrub: true
        }
      })
    })
  }, [])

  return (
    <section ref={containerRef} className={`w-full bg-white ${className}`} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingBottom: 0 }}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start gap-8" style={{ minHeight: '70vh', paddingBottom: 0, marginBottom: 0 }}>
          {items.map((it, idx) => (
            <h2
              key={idx}
              data-text
              className="text-effect text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight w-full border-b border-gray-200"
            >
              {it.primary.toUpperCase()} <span>{it.secondary.toUpperCase()}</span>
            </h2>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .text-effect {
          color: rgba(31, 41, 55, 0.15);
          background: linear-gradient(to right, #111827, #111827) no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          background-size: 0% 100%;
          transition: background-size cubic-bezier(.1,.5,.5,1) .5s;
          line-height: 1.05;
          margin: 0;
          display: flex;
          align-items: center;
          position: relative;
        }
        .text-effect span {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          color: white;
          background-color: #3b82f6;
          clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          transition: clip-path cubic-bezier(.1,.5,.5,1) .4s;
        }
        .text-effect:hover span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </section>
  )
}

export default SolutionHighlights


