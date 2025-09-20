"use client"

import React, { useCallback, useMemo, useState } from 'react'
import { Compare } from '@/components/ui/compare'
import { AnimatePresence, motion, useInView } from 'motion/react'

export function CompareDemo(): JSX.Element {
  const original = '/images/WhatsApp%20Image%202025-09-19%20at%2000.54.35_f264a827.jpg'
  const generatedA = '/images/aurevo-tryon-1758274233947.png'
  const generatedB = '/images/aurevo-tryon-1758279172863.png'
  const variants = useMemo(() => [generatedA, generatedB], [])
  const [index, setIndex] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleComplete = useCallback(() => {
    // Only cycle through variants on desktop
    if (!isMobile) {
      setIndex((i) => (i + 1) % variants.length)
    }
  }, [variants.length, isMobile])

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        {/* Animated Header */}
        <motion.div 
          className="text-center mb-6 md:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Before & After
          </motion.h2>
          <motion.p 
            className="mt-3 text-gray-600 md:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            {isMobile 
              ? "See your photo with the outfit applied. Drag to compare the before and after."
              : "See your photo with the outfit applied. It will cycle through variants automatically."
            }
          </motion.p>
        </motion.div>

        {/* Animated Compare Container */}
        <motion.div 
          className="flex h-[60vh] items-center justify-center px-1 md:px-4"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div 
            className="mx-auto h-5/6 w-full max-w-5xl rounded-3xl bg-white p-2 md:p-4 shadow-[0_10px_30px_rgba(30,58,138,0.06)]"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.9, rotateX: 10 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="h-full"
              >
                <Compare
                  firstImage={isMobile ? generatedB : variants[index]}
                  secondImage={original}
                  firstImageClassName="object-contain object-center w-full"
                  secondImageClassname="object-contain object-center w-full"
                  className="h-full w-full rounded-xl"
                  slideMode="drag"
                  autoplay={!isMobile}
                  autoplayDurationMs={4500}
                  onAutoplayComplete={handleComplete}
                  onProgress={setProgress}
                  showLabels
                  beforeLabel="Original"
                  afterLabel="Try-On"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Animated Variant Indicator - Hidden on mobile */}
            {!isMobile && (
              <motion.div 
                className="mt-4 flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              >
                <div className="text-sm font-medium text-gray-700">Variant {index + 1} of {variants.length}</div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl" />
      </motion.div>
    </motion.section>
  )
}

export default CompareDemo


