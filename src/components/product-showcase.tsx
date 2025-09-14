'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Camera, Sparkles, ArrowRight, Star, ShoppingBag, Zap } from 'lucide-react'

// Register GSAP plugins client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ProductShowcase() {
  const showcaseRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!showcaseRef.current || typeof window === 'undefined') return

    // Ensure GSAP is loaded client-side
    if (!gsap || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.product-card', {
        opacity: 0,
        y: 100,
        rotationY: 45,
        scale: 0.8,
      })

      gsap.set('.showcase-title', {
        opacity: 0,
        y: 50,
      })

      // Title animation
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to('.showcase-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          })
        },
      })

      // Cards stagger animation
      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.to('.product-card', {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)',
          })
        },
      })

      // Parallax effect on scroll
      ScrollTrigger.create({
        trigger: showcaseRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          gsap.to('.product-card:nth-child(odd)', {
            y: progress * -50,
            duration: 0.3,
          })
          gsap.to('.product-card:nth-child(even)', {
            y: progress * 50,
            duration: 0.3,
          })
        },
      })

      // Hover effects
      const cards = document.querySelectorAll('.product-card')
      cards.forEach((card) => {
        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: 1.05,
            rotationY: 5,
            z: 50,
            duration: 0.3,
            ease: 'power2.out',
          })
          
          gsap.to(card.querySelector('.card-glow'), {
            opacity: 0.6,
            duration: 0.3,
          })
        }

        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            rotationY: 0,
            z: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
          
          gsap.to(card.querySelector('.card-glow'), {
            opacity: 0,
            duration: 0.3,
          })
        }

        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)
      })
    }, showcaseRef)

    return () => ctx.revert()
  }, [])

  const products = [
    {
      id: 1,
      name: 'Summer Dress',
      category: 'Fashion',
      image: '/api/placeholder/300/400',
      color: 'from-pink-500 to-rose-600',
      icon: ShoppingBag,
    },
    {
      id: 2,
      name: 'Casual T-Shirt',
      category: 'Basics',
      image: '/api/placeholder/300/400',
      color: 'from-blue-500 to-cyan-600',
      icon: Star,
    },
    {
      id: 3,
      name: 'Designer Jacket',
      category: 'Premium',
      image: '/api/placeholder/300/400',
      color: 'from-purple-500 to-indigo-600',
      icon: Sparkles,
    },
    {
      id: 4,
      name: 'Sports Wear',
      category: 'Athletic',
      image: '/api/placeholder/300/400',
      color: 'from-green-500 to-emerald-600',
      icon: Zap,
    },
  ]

  return (
    <section
      ref={showcaseRef}
      className="py-20 px-4 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="showcase-title text-4xl md:text-6xl font-bold text-white mb-6">
            Virtual Try-On
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="showcase-title text-xl text-gray-300 max-w-2xl mx-auto">
            See how any outfit looks on you with our AI-powered virtual fitting room
          </p>
        </div>

        {/* Product Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const IconComponent = product.icon
            return (
              <div
                key={product.id}
                className="product-card relative group cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                {/* Card Glow Effect */}
                <div
                  className={`card-glow absolute inset-0 bg-gradient-to-r ${product.color} rounded-2xl blur-xl opacity-0 transition-opacity duration-300`}
                />
                
                {/* Main Card */}
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 h-full">
                  {/* Product Icon/Image Placeholder */}
                  <div className={`w-full h-48 bg-gradient-to-br ${product.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <IconComponent className="w-16 h-16 text-white/80" />
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <span className="text-sm text-purple-400 font-medium">{product.category}</span>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  </div>

                  {/* Try On Button */}
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Try On
                  </Button>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Star className="w-3 h-3 text-yellow-900 fill-current" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            Explore All Products
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
