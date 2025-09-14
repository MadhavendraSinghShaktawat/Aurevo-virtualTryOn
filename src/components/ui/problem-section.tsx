'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ProblemSectionProps { className?: string }

const problems = [
  { base: 'Endless', focus: 'Guessing' },
  { base: 'Wasted', focus: 'Returns' },
  { base: 'Wrong', focus: 'Sizes' },
  { base: 'Poor', focus: 'Fit' }
]

export function ProblemSection({ className = '' }: ProblemSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.utils.toArray<HTMLElement>(sectionRef.current.querySelectorAll('[data-problem-item]')).forEach((el, i) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 60%',
          scrub: true
        }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className={`w-full bg-gray-50 py-20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 text-center">The Old Way</h2>
        <p className="text-center text-gray-600 mt-4">Endless guessing, wasted returns, and clothes that never fit right.</p>

        <div className="mt-14 divide-y divide-gray-200">
          {problems.map((p, idx) => (
            <div key={idx} data-problem-item className="py-10">
              <h3 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                <span className="text-gray-300">{p.base}. </span>
                <span className="text-gray-900">{p.focus}.</span>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
