'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface MarqueeProps {
  text: string
  duration?: number
  className?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
}

export function BrandMarquee({ 
  text, 
  duration = 15, 
  className = '',
  backgroundColor = 'bg-blue-500',
  textColor = 'text-white',
  accentColor = 'text-blue-200'
}: MarqueeProps) {
  const tickerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const animationsRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    if (!tickerRef.current || !wrapRef.current) return

    const ticker = tickerRef.current
    const wrap = wrapRef.current
    const content = wrap.querySelector('.ticker-text')
    
    if (!content) return

    // Clone the content for seamless loop
    wrap.appendChild(content.cloneNode(true))

    // Clear previous animations
    animationsRef.current.forEach(anim => anim.kill())
    animationsRef.current = []

    // Create animations for each text element
    const textElements = wrap.querySelectorAll('.ticker-text')
    textElements.forEach((element) => {
      const animation = gsap.to(element, {
        x: '-100%',
        repeat: -1,
        duration: duration,
        ease: 'linear'
      })
      animationsRef.current.push(animation)
    })

    // Add cursor hover pause functionality
    const handleMouseEnter = () => {
      animationsRef.current.forEach(anim => anim.pause())
    }

    const handleMouseLeave = () => {
      animationsRef.current.forEach(anim => anim.play())
    }

    ticker.addEventListener('mouseenter', handleMouseEnter)
    ticker.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      ticker.removeEventListener('mouseenter', handleMouseEnter)
      ticker.removeEventListener('mouseleave', handleMouseLeave)
      animationsRef.current.forEach(anim => anim.kill())
    }
  }, [text, duration, accentColor])

  // Process text to add accent spans around words between bullet points
  const processText = (text: string) => {
    return text.split('•').map((segment, index) => {
      if (index === 0) return segment // First segment before any bullet
      
      const trimmed = segment.trim()
      const words = trimmed.split(' ')
      
      // Find potential accent words (words that should be highlighted)
      const accentWords = ['photo', 'outfit', 'results', 'confidence', 'extension', 'instantly', 'perfect', 'fit']
      
      const processedWords = words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
        if (accentWords.includes(cleanWord)) {
          const accentClass = accentColor === 'text-blue-200' ? 'text-blue-300' : 
                             accentColor === 'text-blue-600' ? 'text-blue-600' : 'text-gray-500'
          return `<span class="${accentClass} font-medium" style="font-size: 1.1em;">${word}</span>`
        }
        return word
      })
      
      return ' • ' + processedWords.join(' ')
    }).join('')
  }

  return (
    <div 
      ref={tickerRef}
      className={`ticker overflow-hidden whitespace-nowrap py-4 ${backgroundColor} ${className}`}
      data-cursor-hover
    >
      <div 
        ref={wrapRef}
        className="ticker-wrap flex gap-5"
      >
        <div 
          className={`ticker-text ${textColor} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight`}
          dangerouslySetInnerHTML={{ __html: processText(text) }}
        />
      </div>
      <div data-cursor-bounds className="absolute inset-0"></div>
    </div>
  )
}

interface BrandMarqueeSectionProps {
  className?: string
}

export function BrandMarqueeSection({ className = '' }: BrandMarqueeSectionProps) {
  return (
    <section className={`flex flex-col justify-center gap-8 py-16 overflow-hidden bg-gray-50 ${className}`}>
      {/* Top Marquee - Benefits */}
      <BrandMarquee
        text="Try clothes instantly • See perfect fit • Shop with confidence • No more returns • Try clothes instantly • See perfect fit • Shop with confidence • No more returns"
        duration={20}
        backgroundColor="bg-blue-500"
        textColor="text-white"
        accentColor="text-blue-200"
        className="transform rotate-1 scale-105"
      />
      
      {/* Bottom Marquee - Process */}
      <BrandMarquee
        text="Upload your photo • Try any outfit • See instant results • Shop with confidence • Free Chrome extension • Upload your photo • Try any outfit • See instant results"
        duration={25}
        backgroundColor="bg-gray-800"
        textColor="text-white"
        accentColor="text-blue-300"
        className="transform -rotate-1 scale-105"
      />
    </section>
  )
}
