'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface FoldEffectProps {
  className?: string
}

interface MarqueeData {
  text: string
  focusWord: string
}

const problemMarquees: MarqueeData[] = [
  { text: "Endless.Guessing.", focusWord: "Endless.Guessing." },
  { text: "Wasted.Returns.", focusWord: "Wasted.Returns." },
  { text: "Wrong.Sizes.", focusWord: "Wrong.Sizes." },
  { text: "Poor.Fit.", focusWord: "Poor.Fit." }
]

function MarqueeRow({ data, index }: { data: MarqueeData; index: number }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const track = trackRef.current
    const isEven = index % 2 === 0
    const [x, xEnd] = isEven ? [-500, -1500] : [-500, 0]

    gsap.fromTo(track, 
      { x }, 
      {
        x: xEnd,
        scrollTrigger: {
          trigger: track.closest('.fold-effect-container'),
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [index])

  const processText = (text: string, focusWord: string) => {
    const baseText = text.replace('.', '.')
    let result = ''
    
    for (let i = 0; i < 8; i++) {
      if (i === 2) {
        result += `<span class="text-gray-900 font-black">${focusWord}</span>`
      } else {
        result += baseText
      }
    }
    
    return result
  }

  return (
    <div className="marquee border-b border-gray-600 text-gray-300 overflow-hidden relative w-full h-[calc(170px+4rem)]">
      <div 
        ref={trackRef}
        className="track h-full overflow-hidden py-8 absolute whitespace-nowrap flex items-center"
        style={{ fontSize: 'clamp(3.00rem, 2.50rem + 3.00vw, 6.00rem)' }}
      >
        <div 
          className="text inline-flex items-center font-bold will-change-transform"
          dangerouslySetInnerHTML={{ 
            __html: processText(data.text, data.focusWord)
          }}
        />
      </div>
    </div>
  )
}

export function FoldEffect({ className = '' }: FoldEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerContentRef = useRef<HTMLDivElement>(null)
  const centerFoldRef = useRef<HTMLDivElement>(null)
  const foldsContentRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!centerContentRef.current || !centerFoldRef.current || !containerRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    // Scroll-based animation for fold content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const translateY = (progress - 0.5) * 200 // Adjust multiplier as needed
          
          foldsContentRef.current.forEach(content => {
            if (content) {
              gsap.set(content, { y: translateY })
            }
          })
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const addToFoldsContent = (el: HTMLDivElement | null) => {
    if (el && !foldsContentRef.current.includes(el)) {
      foldsContentRef.current.push(el)
    }
  }

  const setCenterContentRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      (centerContentRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      addToFoldsContent(el)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`fold-effect-container relative w-full min-h-screen flex items-center justify-center ${className}`}
    >
      <div 
        className="wrapper-3d relative z-0"
        style={{ 
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Top Fold */}
        <div 
          className="fold fold-top absolute left-0 right-0 w-full h-[100vh] overflow-hidden z-10"
          style={{
            transformOrigin: 'bottom center',
            top: '-50vh',
            transform: 'rotateX(-60deg)'
          }}
        >
          <div 
            className="fold-align w-full h-full"
            style={{ transform: 'translateY(0%)' }}
          >
            <div 
              ref={addToFoldsContent}
              className="fold-content"
            >
              {problemMarquees.map((marquee, index) => (
                <MarqueeRow key={`top-${index}`} data={marquee} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Center Fold */}
        <div 
          ref={centerFoldRef}
          className="fold fold-center w-full min-h-[100vh] overflow-hidden bg-white z-20"
        >
          <div className="fold-align w-full h-full flex items-center justify-center">
            <div 
              ref={setCenterContentRef}
              className="fold-content text-center px-8 py-20"
            >
              {/* Problem Statement Only */}
              <div>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                  The Problem
                </h2>
                <p className="text-2xl sm:text-3xl md:text-4xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  Shopping online means endless guessing, wasted returns, and clothes that never fit right.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fold */}
        <div 
          className="fold fold-bottom absolute left-0 right-0 w-full h-[100vh] overflow-hidden z-10"
          style={{
            transformOrigin: 'top center',
            bottom: '-50vh',
            transform: 'rotateX(60deg)'
          }}
        >
          <div 
            className="fold-align w-full h-full"
            style={{ transform: 'translateY(0%)' }}
          >
            <div 
              ref={addToFoldsContent}
              className="fold-content"
            >
              {problemMarquees.map((marquee, index) => (
                <MarqueeRow key={`bottom-${index}`} data={marquee} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
