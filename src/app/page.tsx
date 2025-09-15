'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/button'
import { PricingOverlay } from '@/components/ui/pricing-overlay'
import { FloatingDock } from '@/components/ui/floating-dock'
import { useAuthSession } from '@/hooks/useAuthSession'
import ProfileOverlay from '@/components/ui/profile-overlay'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { BrandMarqueeSection } from '@/components/ui/brand-marquee'
import SessionSync from '@/components/session-sync'
import { SolutionHighlights } from '@/components/ui/solution-highlights'
import { Footer } from '@/components/ui/footer'
import { 
  Camera, 
  Star,
  Chrome
} from 'lucide-react'

const dockItems = [
  { title: "Home", href: "#" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "/contact" },
]

export default function OnivoLandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const { user } = useAuthSession()

  return (
    <div ref={containerRef} className="bg-gray-50 relative custom-cursor-active">
      <SessionSync />
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Main Hero Section */}
      <motion.main 
        className="relative min-h-screen"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Floating Design Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Left side floating cards - Hidden on small screens */}
          <div 
            className="hidden md:block absolute top-16 lg:top-20 left-4 lg:left-8 xl:left-16 transform rotate-12 cursor-interactive"
            data-cursor-hover
          >
            <div className="w-36 h-24 lg:w-48 lg:h-32 xl:w-56 xl:h-36 bg-white rounded-lg shadow-lg border p-3 lg:p-4 hover:shadow-xl transition-all duration-300">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded mb-1"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded w-3/4"></div>
            </div>
            <div data-cursor-bounds className="absolute inset-0"></div>
          </div>

          <div className="hidden lg:block absolute top-48 xl:top-60 left-8 xl:left-16 transform -rotate-6">
            <div className="w-32 h-20 lg:w-40 lg:h-28 xl:w-48 xl:h-32 bg-white rounded-lg shadow-lg border p-2 lg:p-3">
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded mb-2"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded mb-2"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded w-2/3"></div>
            </div>
          </div>

          {/* Right side floating cards - Hidden on small screens */}
          <div 
            className="hidden md:block absolute top-24 lg:top-32 right-4 lg:right-12 xl:right-16 transform -rotate-12 cursor-interactive"
            data-cursor-hover
          >
            <div className="w-36 h-28 lg:w-44 lg:h-36 xl:w-52 xl:h-40 bg-white rounded-lg shadow-lg border p-3 lg:p-4 hover:shadow-xl transition-all duration-300">
              <div className="w-full h-12 lg:h-16 bg-gradient-to-br from-green-100 to-green-200 rounded mb-2"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded mb-1"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded w-3/4"></div>
            </div>
            <div data-cursor-bounds className="absolute inset-0"></div>
          </div>

          <div className="hidden lg:block absolute top-64 xl:top-80 right-4 xl:right-8 transform rotate-6">
            <div className="w-40 h-24 lg:w-52 lg:h-32 xl:w-60 xl:h-36 bg-white rounded-lg shadow-lg border p-3 lg:p-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 lg:w-6 lg:h-6 bg-blue-100 rounded-full mr-2"></div>
                <div className="h-1.5 lg:h-2 bg-gray-100 rounded flex-1"></div>
              </div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded mb-1"></div>
              <div className="h-1.5 lg:h-2 bg-gray-100 rounded w-4/5"></div>
            </div>
          </div>

          {/* Bottom floating cards - Hidden on small/medium screens */}
          <div className="hidden xl:block absolute bottom-32 2xl:bottom-40 left-24 2xl:left-32 transform rotate-3 pointer-events-none">
            <div className="w-32 h-20 xl:w-36 xl:h-24 bg-white rounded-lg shadow-lg border p-3">
              <div className="w-6 h-6 xl:w-8 xl:h-8 bg-pink-100 rounded-full mb-2"></div>
              <div className="h-1.5 xl:h-2 bg-gray-100 rounded"></div>
            </div>
          </div>

          <div className="hidden xl:block absolute bottom-24 2xl:bottom-32 right-32 2xl:right-40 transform -rotate-3 pointer-events-none">
            <div className="w-40 h-24 xl:w-48 xl:h-28 bg-white rounded-lg shadow-lg border p-3 xl:p-4">
              <div className="h-1.5 xl:h-2 bg-gray-100 rounded mb-2"></div>
              <div className="h-1.5 xl:h-2 bg-gray-100 rounded mb-2"></div>
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-orange-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center pt-20 sm:pt-32 md:pt-48 lg:pt-64 xl:pt-80 2xl:pt-96 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight max-w-5xl mx-auto">
            See How It Fits{' '}
            <span className="relative">
              Before You Buy
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-black rounded-full flex items-center justify-center">
                  <Camera className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
            Onivo overlays on any shopping site, letting you try outfits on your photo before checkout.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto max-w-sm mx-auto cursor-interactive"
            data-cursor-hover
          >
            Add Onivo to Chrome — It's Free
            <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
          </Button>

          {/* Chrome Web Store Section */}
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <Chrome className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-semibold text-gray-900">Chrome Web Store</div>
                <div className="text-xs sm:text-sm text-gray-600">50,000+ users</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-bold text-gray-900">4.8</div>
                <div className="text-xs sm:text-sm text-gray-600">14.2k rating</div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Brand Marquee Section */}
      <BrandMarqueeSection />

      {/* Anchor to open overlay from dock */}
      <div id="pricing" className="sr-only" aria-hidden />

      {/* Solution Highlights */}
      <SolutionHighlights />

      {/* Footer */}
      <Footer />

      {/* Pricing Overlay */}
      <PricingOverlay open={showPricing} onClose={() => setShowPricing(false)} />

      {/* Profile Overlay */}
      <ProfileOverlay open={showProfile} onClose={() => setShowProfile(false)} />

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock
          items={[
            { title: 'Home', href: '#' },
            { title: 'Pricing', onClick: () => setShowPricing(true) },
            { title: 'Contact', href: '/contact' },
          ]}
          rightSlot={
            user ? (
              <button
                onClick={() => setShowProfile(true)}
                className="h-11 px-5 flex items-center justify-center rounded-full bg-gray-900 text-white font-medium shadow hover:bg-black active:scale-95 transition-all cursor-interactive"
                data-cursor-hover
              >
                Profile
                <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
              </button>
            ) : undefined
          }
        />
      </div>
    </div>
  )
}