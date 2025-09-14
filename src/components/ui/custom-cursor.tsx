'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface CursorProps {
  className?: string
}

export function CustomCursor({ className = '' }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hoverElement, setHoverElement] = useState<Element | null>(null)

  const position = useRef({
    previous: { x: -100, y: -100 },
    current: { x: -100, y: -100 },
    target: { x: -100, y: -100 },
    lerpAmount: 0.2 // Faster for smoother transitions between elements
  })

  const scale = useRef({
    previous: 1,
    current: 1,
    target: 1,
    lerpAmount: 0.18 // Faster scaling to reduce lag
  })

  // Linear interpolation helper
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  // Update cursor position and animation
  const updateCursor = () => {
    if (!cursorRef.current) return

    const pos = position.current
    const scl = scale.current

    // Lerp position
    pos.current.x = lerp(pos.current.x, pos.target.x, pos.lerpAmount)
    pos.current.y = lerp(pos.current.y, pos.target.y, pos.lerpAmount)

    // Lerp scale
    scl.current = lerp(scl.current, scl.target, scl.lerpAmount)

    // Calculate velocity for stretch effect
    const deltaX = pos.current.x - pos.previous.x
    const deltaY = pos.current.y - pos.previous.y
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Update previous position
    pos.previous.x = pos.current.x
    pos.previous.y = pos.current.y
    scale.current.previous = scl.current

    // Apply transforms
    if (!isHovered) {
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      const distance = velocity * 0.04
      
      gsap.set(cursorRef.current, {
        x: pos.current.x,
        y: pos.current.y,
        rotation: angle,
        scaleX: scl.current + Math.min(distance, 1),
        scaleY: scl.current - Math.min(distance, 0.3),
      })
    } else {
      gsap.set(cursorRef.current, {
        x: pos.current.x,
        y: pos.current.y,
      })
    }
  }

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e

    if (isHovered && hoverElement) {
      const bounds = hoverElement.getBoundingClientRect()
      const centerX = bounds.x + bounds.width / 2
      const centerY = bounds.y + bounds.height / 2
      
      const deltaX = x - centerX
      const deltaY = y - centerY

      // Strong magnetic effect - cursor snaps to center with minimal offset
      position.current.target.x = centerX + deltaX * 0.1
      position.current.target.y = centerY + deltaY * 0.1
      
      // Calculate scale to cover the full button
      const buttonSize = Math.max(bounds.width, bounds.height)
      const desiredScale = (buttonSize + 20) / 24 // 24px is our cursor size, add 20px padding
      scale.current.target = Math.max(desiredScale, 3) // Minimum scale of 3

      // Apply smooth scaling without rotation during hover
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scaleX: scale.current.target,
          scaleY: scale.current.target,
          rotation: 0, // Keep rotation at 0 when hovering
          duration: 0.25, // Faster transition to reduce lag
          ease: "power2.out", // Slightly more responsive easing
          overwrite: true
        })
      }
    } else {
      position.current.target.x = x
      position.current.target.y = y
      scale.current.target = 1
    }
  }

  // Setup hover listeners
  const setupHoverListeners = () => {
    const hoverElements = document.querySelectorAll('[data-cursor-hover]')
    
    hoverElements.forEach((element) => {
      const hoverBounds = element.querySelector('[data-cursor-bounds]') || element

      // Hover enter
      const handleHoverEnter = () => {
        setIsHovered(true)
        setHoverElement(hoverBounds)
      }

      // Hover leave
      const handleHoverLeave = () => {
        setIsHovered(false)
        setHoverElement(null)
      }

      hoverBounds.addEventListener('mouseenter', handleHoverEnter)
      hoverBounds.addEventListener('mouseleave', handleHoverLeave)

      // Magnetic effect for the element itself
      const magneticEffect = () => {
        const xTo = gsap.quickTo(element, 'x', {
          duration: 0.5, // Faster for dock items
          ease: 'power2.out'
        })
        const yTo = gsap.quickTo(element, 'y', {
          duration: 0.5, // Faster for dock items
          ease: 'power2.out'
        })

        const handleElementMove = (event: Event) => {
          const mouseEvent = event as MouseEvent
          const { clientX: cx, clientY: cy } = mouseEvent
          const { height, width, left, top } = element.getBoundingClientRect()
          const x = cx - (left + width / 2)
          const y = cy - (top + height / 2)
          
          // Reduced magnetic strength for subtler element movement
          xTo(x * 0.15)
          yTo(y * 0.15)
        }

        const handleElementLeave = () => {
          xTo(0)
          yTo(0)
        }

        element.addEventListener('mousemove', handleElementMove)
        element.addEventListener('mouseleave', handleElementLeave)
      }

      magneticEffect()
    })
  }

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'
    
    // Setup animation loop
    const ticker = gsap.ticker.add(updateCursor)
    
    // Setup event listeners
    document.addEventListener('mousemove', handleMouseMove)
    
    // Setup hover listeners
    setupHoverListeners()
    
    // Show cursor after setup
    setIsVisible(true)

    return () => {
      // Cleanup
      document.body.style.cursor = 'auto'
      gsap.ticker.remove(ticker)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovered, hoverElement])

  // Re-setup hover listeners when DOM changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setupHoverListeners()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  if (!isVisible) return null

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-6 h-6 bg-gray-100 rounded-full pointer-events-none z-[9999] mix-blend-difference ${className}`}
      style={{
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}
