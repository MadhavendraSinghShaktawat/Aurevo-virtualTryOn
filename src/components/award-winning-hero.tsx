'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Camera, ShoppingBag, Star } from 'lucide-react'

// Register GSAP plugins client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AwardWinningHeroProps {
  onGetStarted?: () => void
}

export function AwardWinningHero({ onGetStarted }: AwardWinningHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current || typeof window === 'undefined') return

    // Ensure GSAP is loaded client-side
    if (!gsap || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 100,
      })

      gsap.set('.floating-element', {
        opacity: 0,
        scale: 0.8,
        rotation: 0,
      })

      gsap.set('.particle', {
        opacity: 0,
        scale: 0,
      })

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: false,
        },
      })

      // Background parallax effect
      tl.to(backgroundRef.current, {
        yPercent: -50,
        ease: 'none',
      }, 0)

      // Title morphing animation
      tl.from(titleRef.current, {
        scale: 0.8,
        rotationX: 45,
        transformOrigin: 'center center',
        ease: 'power2.out',
      }, 0)

      // Subtitle wave effect
      tl.from(subtitleRef.current, {
        opacity: 0.3,
        yPercent: 20,
        skewY: 2,
        ease: 'power2.out',
      }, 0.2)

      // Floating elements with magnetic effect
      gsap.to('.floating-element', {
        duration: 3,
        rotation: 360,
        repeat: -1,
        ease: 'none',
        stagger: 0.5,
      })

      // Particle animation
      gsap.to('.particle', {
        duration: 4,
        y: -200,
        opacity: 0,
        repeat: -1,
        stagger: {
          each: 0.3,
          repeat: -1,
        },
        ease: 'power2.out',
      })

      // Text reveal animation on load
      const loadTl = gsap.timeline({ delay: 0.5 })
      
      loadTl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.8')
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')
      .to('.floating-element', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      }, '-=1')
      .to('.particle', {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      }, '-=0.5')

      // Scroll-based text effects
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          gsap.to(titleRef.current, {
            backgroundPosition: `${progress * 200}% 50%`,
            duration: 0.3,
          })
        },
      })

      // Mouse follow effect for floating elements
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        gsap.to('.floating-element', {
          x: (clientX - centerX) * 0.1,
          y: (clientY - centerY) * 0.1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.02,
        })
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        {/* T-shirt mockup */}
        <div className="floating-element absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        {/* Camera icon */}
        <div className="floating-element absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
          <Camera className="w-10 h-10 text-white" />
        </div>

        {/* Star rating */}
        <div className="floating-element absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-2xl">
          <Star className="w-8 h-8 text-white fill-current" />
        </div>

        {/* Sparkle effect */}
        <div className="floating-element absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        {/* Additional floating elements */}
        <div className="floating-element absolute bottom-20 right-32 w-18 h-18 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center shadow-2xl">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Title */}
          <div ref={titleRef} className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
              <span
                className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              >
                WEARLY
              </span>
            </h1>
            <div className="mt-4">
              <span className="text-2xl md:text-4xl font-bold text-purple-300">
                Try Before You Buy
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of online shopping with AI-powered virtual try-on technology.
            <br />
            <span className="text-purple-300 font-semibold">
              See how clothes look on you before you purchase.
            </span>
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
            >
              <Camera className="mr-3 h-6 w-6" />
              Start Virtual Try-On
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10M+</div>
              <div className="text-purple-300 text-sm">Virtual Try-Ons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-purple-300 text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-purple-300 text-sm">Happy Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-60 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}
