'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!progressRef.current || !circleRef.current || typeof window === 'undefined') return

    // Ensure GSAP is loaded client-side
    if (!gsap || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      const circle = circleRef.current!
      const radius = 30
      const circumference = 2 * Math.PI * radius

      // Set initial circle properties
      gsap.set(circle, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
        rotation: -90,
        transformOrigin: 'center',
      })

      // Create scroll progress animation
      ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const offset = circumference - progress * circumference
          
          gsap.to(circle, {
            strokeDashoffset: offset,
            duration: 0.3,
            ease: 'power2.out',
          })

          // Update text
          if (textRef.current) {
            textRef.current.textContent = Math.round(progress * 100).toString()
          }

          // Morphing effect based on progress
          const hue = progress * 300 // 0 to 300 degrees (purple to pink)
          gsap.to(circle, {
            stroke: `hsl(${hue}, 70%, 60%)`,
            duration: 0.3,
          })

          // Scale effect at milestones
          const milestones = [0.25, 0.5, 0.75, 1]
          milestones.forEach((milestone) => {
            if (Math.abs(progress - milestone) < 0.01) {
              gsap.to(progressRef.current, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
              })
            }
          })
        },
      })

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(progressRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(progressRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      progressRef.current?.addEventListener('mouseenter', handleMouseEnter)
      progressRef.current?.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        progressRef.current?.removeEventListener('mouseenter', handleMouseEnter)
        progressRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, progressRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={progressRef}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 cursor-pointer"
    >
      {/* Background Circle */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-full border border-white/10" />
      
      {/* Progress SVG */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 64 64"
      >
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <circle
          ref={circleRef}
          cx="32"
          cy="32"
          r="30"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Progress Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          ref={textRef}
          className="text-white text-sm font-bold"
        >
          0
        </span>
      </div>

      {/* Pulse Effect */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-pulse" />
    </div>
  )
}
