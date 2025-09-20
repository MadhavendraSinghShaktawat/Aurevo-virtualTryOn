"use client"

import React, { useCallback, useMemo, useRef, useState } from 'react'

export type CompareSlideMode = 'drag' | 'hover'

export interface CompareProps {
  /** Base image (typically the original/before). */
  firstImage: string
  /** Overlay image (typically the edited/after). */
  secondImage: string
  /** Wrapper classes. */
  className?: string
  /** Class for the first image element. */
  firstImageClassName?: string
  /**
   * Class for the second image element.
   * Named to match the requested API.
   */
  secondImageClassname?: string
  /** Interaction mode. */
  slideMode?: CompareSlideMode
  /** Enable automatic sweep from left to right. */
  autoplay?: boolean
  /** Duration in ms for a full sweep from 0% to 100%. */
  autoplayDurationMs?: number
  /** Callback when autoplay reaches the end (100%). */
  onAutoplayComplete?: () => void
  /** Callback on progress updates (0-100). */
  onProgress?: (percent: number) => void
  /** Pause autoplay when hovered. */
  pauseOnHover?: boolean
  /** Show overlay labels. */
  showLabels?: boolean
  /** Left label text. */
  beforeLabel?: string
  /** Right label text. */
  afterLabel?: string
  /** Optional class for labels. */
  labelClassName?: string
}

/**
 * A simple before/after image comparison slider with a draggable handle.
 */
export function Compare(props: CompareProps): JSX.Element {
  const {
    firstImage,
    secondImage,
    className,
    firstImageClassName,
    secondImageClassname,
    slideMode = 'drag',
    autoplay = false,
    autoplayDurationMs = 4000,
    onAutoplayComplete,
    onProgress,
    pauseOnHover = true,
    showLabels = true,
    beforeLabel = 'Before',
    afterLabel = 'After',
    labelClassName,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const [positionPct, setPositionPct] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const clamp = useCallback((value: number): number => {
    if (value < 0) return 0
    if (value > 100) return 100
    return value
  }, [])

  const updateFromEvent = useCallback((clientX: number): void => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const relativeX = clientX - rect.left
    const pct = (relativeX / rect.width) * 100
    const clamped = clamp(pct)
    setPositionPct(clamped)
    onProgress?.(clamped)
  }, [clamp, onProgress])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    setIsDragging(true)
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    updateFromEvent(e.clientX)
  }, [updateFromEvent])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging && slideMode !== 'hover') return
    updateFromEvent(e.clientX)
  }, [isDragging, slideMode, updateFromEvent])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    setIsDragging(false)
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }, [])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>): void => {
    if (slideMode !== 'drag') return
    setIsDragging(true)
    const touch = e.touches[0]
    if (touch) updateFromEvent(touch.clientX)
  }, [slideMode, updateFromEvent])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>): void => {
    if (!isDragging) return
    e.preventDefault() // Prevent scrolling
    const touch = e.touches[0]
    if (touch) updateFromEvent(touch.clientX)
  }, [isDragging, updateFromEvent])

  const handleTouchEnd = useCallback((): void => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback((): void => {
    if (slideMode === 'hover') setIsDragging(false)
  }, [slideMode])

  const maskStyle = useMemo(() => ({
    clipPath: `inset(0 ${100 - positionPct}% 0 0)`
  }), [positionPct])

  // Autoplay sweep from 0 -> 100 repeatedly
  React.useEffect(() => {
    if (!autoplay || isDragging || (pauseOnHover && isHovered)) return
    let rafId: number | null = null
    let startTime: number | null = null
    const startPct = 0
    const endPct = 100

    const step = (ts: number) => {
      if (startTime === null) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(1, elapsed / Math.max(1, autoplayDurationMs))
      const next = startPct + (endPct - startPct) * progress
      setPositionPct(next)
      onProgress?.(next)
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        onAutoplayComplete?.()
        startTime = null
        setPositionPct(0)
        onProgress?.(0)
        rafId = requestAnimationFrame(step)
      }
    }
    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [autoplay, isDragging, isHovered, pauseOnHover, autoplayDurationMs, onAutoplayComplete, onProgress])

  return (
    <div
      ref={containerRef}
      className={[
        'relative overflow-hidden select-none bg-white group',
        'shadow-[0_10px_40px_rgba(59,130,246,0.08)] rounded-xl md:rounded-3xl',
        'hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)] transition-all duration-500',
        'border border-gray-100/50',
        'w-full h-auto min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]',
        className ?? ''
      ].join(' ')}
      onPointerDown={slideMode === 'drag' ? handlePointerDown : undefined}
      onPointerMove={handlePointerMove}
      onPointerUp={slideMode === 'drag' ? handlePointerUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        handleMouseLeave()
        setIsHovered(false)
      }}
      role="group"
      aria-roledescription="before-after image comparison"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
      </div>

      {/* Bold Corner Labels */}
      {showLabels && (
        <>
          <div
            className={[
              'absolute top-3 left-3 sm:top-6 sm:left-6 z-20 pointer-events-none',
              'px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md bg-white/90 border border-gray-200/60',
              'text-xs sm:text-sm font-bold tracking-tight text-gray-900 rounded-lg sm:rounded-xl shadow-lg',
              'group-hover:scale-105 transition-transform duration-300',
              labelClassName ?? ''
            ].join(' ')}
          >
            {beforeLabel}
          </div>
          <div
            className={[
              'absolute top-3 right-3 sm:top-6 sm:right-6 z-20 pointer-events-none',
              'px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md bg-blue-500/95 border border-blue-600/60',
              'text-xs sm:text-sm font-bold tracking-tight text-white rounded-lg sm:rounded-xl shadow-lg',
              'group-hover:scale-105 transition-transform duration-300',
              labelClassName ?? ''
            ].join(' ')}
          >
            {afterLabel}
          </div>
        </>
      )}

      {/* Progress Indicator (Floating) */}
      {autoplay && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-6 z-20 pointer-events-none">
          <div className="px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md bg-white/90 border border-gray-200/60 rounded-full shadow-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-12 h-1 sm:w-16 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-100"
                  style={{ width: `${positionPct}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(positionPct)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <img
        src={firstImage}
        alt="Before"
        className={[
          'absolute inset-0 h-full w-full object-contain',
          firstImageClassName ?? ''
        ].join(' ')}
        draggable={false}
      />

      <div className="absolute inset-0" style={maskStyle} aria-hidden>
        <img
          src={secondImage}
          alt="After"
          className={[
            'absolute inset-0 h-full w-full object-contain',
            secondImageClassname ?? ''
          ].join(' ')}
          draggable={false}
        />
      </div>

      {/* Enhanced Divider */}
      <div
        className="absolute top-0 h-full z-10"
        style={{ left: `calc(${positionPct}% - 2px)` }}
        aria-hidden
      >
        {/* Main divider line with gradient */}
        <div className={[
          'h-full w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600',
          'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
          autoplay ? 'animate-pulse' : ''
        ].join(' ')} />
        
        {/* Enhanced handle */}
        <div
          className={[
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600',
            'shadow-[0_8px_32px_rgba(59,130,246,0.3)] border-2 sm:border-4 border-white',
            'grid place-items-center text-white cursor-grab active:cursor-grabbing',
            'hover:scale-110 transition-all duration-300',
            'group-hover:shadow-[0_12px_48px_rgba(59,130,246,0.4)]'
          ].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
          >
            <path d="M13.25 4.5a.75.75 0 0 0-1.5 0v15a.75.75 0 0 0 1.5 0v-15Z" />
            <path d="M9.25 8.25 4.5 12l4.75 3.75v-7.5Zm5.5 0v7.5L19.5 12l-4.75-3.75Z" />
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(59,130,246,${autoplay ? 0.15 : 0.08}) 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Hover Instructions */}
      <div className={[
        'absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100',
        'transition-opacity duration-300 pointer-events-none z-30',
        'flex items-center justify-center'
      ].join(' ')}>
        <div className="backdrop-blur-sm bg-white/90 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/60">
          <p className="text-xs sm:text-sm font-medium text-gray-700 tracking-tight text-center">
            <span className="hidden sm:inline">Drag to compare • Hover to pause</span>
            <span className="sm:hidden">Tap to compare</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Compare


