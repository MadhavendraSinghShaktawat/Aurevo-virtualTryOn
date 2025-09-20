'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { Upload, MousePointer, Sparkles } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ProcessSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  images: {
    main: string;
  };
}

interface ProcessSectionProps {
  className?: string;
}

const processData: ProcessSlide[] = [
  {
    id: 0, // Hero slide
    title: "How It",
    subtitle: "Works",
    description: "Three simple steps to transform your online shopping experience",
    icon: null,
    images: {
      main: ""
    }
  },
  {
    id: 1,
    title: "Upload",
    subtitle: "Your Photo",
    description: "Login to your account and upload your photo. Our AI will analyze your body shape for the perfect fit.",
    icon: <Upload className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12" />,
    images: {
      main: "/process section/Screenshot 2025-09-20 140216.png"
    }
  },
  {
    id: 2,
    title: "Try-On",
    subtitle: "Any Outfit",
    description: "Right-click on any clothing item and select 'Try on with Aurevo'. Watch the magic happen instantly.",
    icon: <MousePointer className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12" />,
    images: {
      main: "/process section/Screenshot 2025-09-20 140255.png"
    }
  },
  {
    id: 3,
    title: "Perfect",
    subtitle: "Results",
    description: "See how the outfit looks on you with realistic fit and styling. Make confident purchase decisions.",
    icon: <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12" />,
    images: {
      main: "/process section/aurevo-tryon-1758357271416.png"
    }
  }
];

// Enhanced breakpoints with more granular control
const BREAKPOINTS = {
  xs: 375,    // Extra small phones
  sm: 640,    // Small phones
  md: 768,    // Tablets
  lg: 1024,   // Small laptops
  xl: 1280,   // Large laptops
  '2xl': 1536,// Desktop
  '3xl': 1920 // Large desktop
};

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export function ProcessSection({ className }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');
  const [isMounted, setIsMounted] = useState(false);

  // Enhanced responsive detection with more breakpoints
  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth;
    if (width < BREAKPOINTS.xs) {
      setScreenSize('xs');
    } else if (width < BREAKPOINTS.sm) {
      setScreenSize('sm');
    } else if (width < BREAKPOINTS.md) {
      setScreenSize('md');
    } else if (width < BREAKPOINTS.lg) {
      setScreenSize('lg');
    } else if (width < BREAKPOINTS.xl) {
      setScreenSize('xl');
    } else if (width < BREAKPOINTS['2xl']) {
      setScreenSize('2xl');
    } else {
      setScreenSize('3xl');
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    updateScreenSize();
    const debouncedResize = debounce(updateScreenSize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [updateScreenSize]);

  useEffect(() => {
    if (!sectionRef.current || !slidesRef.current || !isMounted) return;

    const slides = slidesRef.current.querySelectorAll('.process-slide');
    
    // Clear existing animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Desktop layout for xl and larger screens 
    const isDesktopLayout = ['xl', '2xl', '3xl'].includes(screenSize);

    if (isDesktopLayout) {
      // Set container to relative position to fix ScrollTrigger warning
      gsap.set(sectionRef.current, { position: 'relative', zIndex: 1 });
      gsap.set(slidesRef.current, { position: 'relative', zIndex: 2 });
      
      // Ensure all images are visible from the start on desktop
      slides.forEach((slide, index) => {
        if (index === 0) return; // Skip hero slide
        
        const stepImage = slide.querySelector('.step-image');
        if (stepImage) {
          gsap.set(stepImage, { 
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            visibility: 'visible',
            display: 'block'
          });
        }
      });

      // Desktop: Horizontal scroll animation with proper cleanup
      const scrollAnimation = gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom", // Changed from calculated percentage
          scrub: 1,
          pin: slidesRef.current,
          anticipatePin: 1,
          pinSpacing: true, // Ensure proper spacing after pin
          onUpdate: (self) => {
            // Debug: log scroll progress
            if (self.progress === 1) {
              console.log('Animation complete, should release pin');
            }
          }
        }
      });

      // Desktop animations for each slide - simplified to avoid hiding images
      slides.forEach((slide, index) => {
        if (index === 0) return; // Skip hero slide
        
        const stepContent = slide.querySelector('.step-content');
        
        if (stepContent) {
          gsap.fromTo(stepContent, 
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: slide,
                start: "left center",
                end: "center center",
                scrub: 1,
              }
            }
          );
        }
      });
    } else {
      // Mobile/Tablet: Enhanced responsive scroll with device-specific optimizations
      slides.forEach((slide, index) => {
        const stepContent = slide.querySelector('.step-content');
        const stepImage = slide.querySelector('.step-image');
        const elements = slide.querySelectorAll('.animate-element');
        
         // Device-specific animation settings
         const animationSettings: Record<ScreenSize, { duration: number; stagger: number; yOffset: number }> = {
           xs: { duration: 0.6, stagger: 0.08, yOffset: 30 },
           sm: { duration: 0.7, stagger: 0.09, yOffset: 35 },
           md: { duration: 0.8, stagger: 0.1, yOffset: 40 },
           lg: { duration: 0.9, stagger: 0.12, yOffset: 45 },
           xl: { duration: 0.9, stagger: 0.12, yOffset: 45 },
           '2xl': { duration: 0.9, stagger: 0.12, yOffset: 45 },
           '3xl': { duration: 0.9, stagger: 0.12, yOffset: 45 }
         };
         
         const settings = animationSettings[screenSize] || animationSettings.md;
        
        // Staggered content animation with device optimization
        if (elements.length > 0) {
          gsap.fromTo(elements, 
            { y: settings.yOffset, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: settings.duration,
              ease: "power2.out",
              stagger: settings.stagger,
              scrollTrigger: {
                trigger: slide,
                start: screenSize === 'xs' ? "top 90%" : "top 85%",
                end: screenSize === 'xs' ? "top 60%" : "top 50%",
                scrub: 1,
              }
            }
          );
        } else if (stepContent) {
          gsap.fromTo(stepContent, 
            { y: settings.yOffset, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: settings.duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: slide,
                start: screenSize === 'xs' ? "top 90%" : "top 85%",
                end: screenSize === 'xs' ? "top 60%" : "top 50%",
                scrub: 1,
              }
            }
          );
        }

        if (stepImage) {
          // Set initial visible state for mobile/tablet
          gsap.set(stepImage, { 
            scale: 1,
            opacity: 1,
            y: 0,
            rotateY: 0
          });
          
          // Device-specific image animation
          const imageScale = screenSize === 'xs' ? { from: 0.98, to: 1.01 } : { from: 0.98, to: 1.02 };
          
          gsap.fromTo(stepImage, 
            { scale: imageScale.from },
            {
              scale: imageScale.to,
              duration: settings.duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: slide,
                start: screenSize === 'xs' ? "top 80%" : "top 75%",
                end: screenSize === 'xs' ? "top 50%" : "top 40%",
                scrub: 1,
              }
            }
          );
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
      });
      // Force a refresh to clean up any lingering effects
      ScrollTrigger.refresh();
    };
  }, [screenSize, isMounted]);

  const isVerticalLayout = !['xl', '2xl', '3xl'].includes(screenSize);
  const processSteps = processData.slice(1); // Remove hero slide for step counting

  // Get spacing for vertical layout
  const getSpacing = () => {
    switch (screenSize) {
      case 'xs': return {
        container: 'px-2 xs:px-3',
        section: 'py-4 xs:py-6',
        elementGap: 'space-y-4 xs:space-y-5',
        titleGap: 'space-y-1 xs:space-y-2'
      };
      case 'sm': return {
        container: 'px-3 sm:px-4',
        section: 'py-6 sm:py-8',
        elementGap: 'space-y-5 sm:space-y-6',
        titleGap: 'space-y-2 sm:space-y-3'
      };
      case 'md': return {
        container: 'px-4 md:px-6',
        section: 'py-8 md:py-10',
        elementGap: 'space-y-6 md:space-y-7',
        titleGap: 'space-y-2 md:space-y-3'
      };
      case 'lg': return {
        container: 'px-6 lg:px-8',
        section: 'py-10 lg:py-12',
        elementGap: 'space-y-7 lg:space-y-8',
        titleGap: 'space-y-3 lg:space-y-4'
      };
      default: return {
        container: 'px-4',
        section: 'py-8',
        elementGap: 'space-y-6',
        titleGap: 'space-y-3'
      };
    }
  };

  const spacing = getSpacing();

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return <div className="w-full h-screen bg-white" />;
  }

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "w-full bg-white overflow-hidden",
        isVerticalLayout ? `relative ${spacing.section}` : "relative",
        className
      )}
      style={{ 
        position: 'relative',
        zIndex: 1,
        ...(isVerticalLayout ? {} : { height: '400vh' })
      }}
    >
      <div 
        ref={slidesRef}
        className={cn(
          "w-full",
          isVerticalLayout 
            ? "space-y-8 xs:space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20" 
            : "sticky top-0 left-0 flex gap-0 h-screen"
        )}
        style={{
          position: isVerticalLayout ? 'static' : 'relative',
          zIndex: 2
        }}
      >
        {processData.map((step, index) => (
          <ProcessSlide 
            key={step.id}
            step={step}
            index={index}
            screenSize={screenSize}
            totalSteps={processSteps.length}
          />
        ))}
      </div>
    </section>
  );
}

interface ProcessSlideProps {
  step: ProcessSlide;
  index: number;
  screenSize: ScreenSize;
  totalSteps: number;
}

function ProcessSlide({ step, index, screenSize, totalSteps }: ProcessSlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const isVerticalLayout = !['xl', '2xl', '3xl'].includes(screenSize);
  const isHeroSlide = index === 0;
  const stepNumber = isHeroSlide ? 0 : index;

  // Responsive text sizes based on screen size
  const getHeroTitleSize = () => {
    switch (screenSize) {
      case 'xs': return 'text-2xl xs:text-3xl';
      case 'sm': return 'text-3xl sm:text-4xl';
      case 'md': return 'text-4xl md:text-5xl';
      case 'lg': return 'text-5xl lg:text-6xl';
      case 'xl': return 'text-7xl';
      case '2xl': return 'text-8xl';
      case '3xl': return 'text-9xl';
      default: return 'text-6xl';
    }
  };

  const getStepTitleSize = () => {
    if (isVerticalLayout) {
      switch (screenSize) {
        case 'xs': return 'text-xl xs:text-2xl';
        case 'sm': return 'text-2xl sm:text-3xl';
        case 'md': return 'text-3xl md:text-4xl';
        case 'lg': return 'text-4xl lg:text-5xl';
        default: return 'text-4xl';
      }
    } else {
      switch (screenSize) {
        case 'xl': return 'text-4xl';
        case '2xl': return 'text-5xl';
        case '3xl': return 'text-6xl';
        default: return 'text-4xl';
      }
    }
  };

  const getStepSubtitleSize = () => {
    switch (screenSize) {
      case 'xs': return 'text-lg xs:text-xl';
      case 'sm': return 'text-xl sm:text-2xl';
      case 'md': return 'text-2xl md:text-3xl';
      case 'lg': return 'text-3xl lg:text-4xl';
      default: return 'text-2xl';
    }
  };

  const getDescriptionSize = () => {
    switch (screenSize) {
      case 'xs': return 'text-xs xs:text-sm';
      case 'sm': return 'text-sm sm:text-base';
      case 'md': return 'text-base md:text-lg';
      case 'lg': return 'text-lg lg:text-xl';
      case 'xl': return 'text-lg';
      case '2xl': return 'text-xl';
      case '3xl': return 'text-2xl';
      default: return 'text-base';
    }
  };

  const getIconSize = () => {
    switch (screenSize) {
      case 'xs': return 'w-10 h-10 xs:w-12 xs:h-12';
      case 'sm': return 'w-12 h-12 sm:w-14 sm:h-14';
      case 'md': return 'w-14 h-14 md:w-16 md:h-16';
      case 'lg': return 'w-16 h-16 lg:w-18 lg:h-18';
      case 'xl': return 'w-20 h-20';
      case '2xl': return 'w-24 h-24';
      case '3xl': return 'w-28 h-28';
      default: return 'w-16 h-16';
    }
  };

  const getImageMaxWidth = () => {
    switch (screenSize) {
      case 'xs': return 'max-w-[280px] xs:max-w-xs';
      case 'sm': return 'max-w-xs sm:max-w-sm';
      case 'md': return 'max-w-sm md:max-w-md';
      case 'lg': return 'max-w-md lg:max-w-lg';
      default: return 'max-w-md';
    }
  };

  const getSpacing = () => {
    switch (screenSize) {
      case 'xs': return {
        container: 'px-2 xs:px-3',
        section: 'py-4 xs:py-6',
        elementGap: 'space-y-4 xs:space-y-5',
        titleGap: 'space-y-1 xs:space-y-2'
      };
      case 'sm': return {
        container: 'px-3 sm:px-4',
        section: 'py-6 sm:py-8',
        elementGap: 'space-y-5 sm:space-y-6',
        titleGap: 'space-y-2 sm:space-y-3'
      };
      case 'md': return {
        container: 'px-4 md:px-6',
        section: 'py-8 md:py-10',
        elementGap: 'space-y-6 md:space-y-7',
        titleGap: 'space-y-2 md:space-y-3'
      };
      case 'lg': return {
        container: 'px-6 lg:px-8',
        section: 'py-10 lg:py-12',
        elementGap: 'space-y-7 lg:space-y-8',
        titleGap: 'space-y-3 lg:space-y-4'
      };
      default: return {
        container: 'px-4',
        section: 'py-8',
        elementGap: 'space-y-6',
        titleGap: 'space-y-3'
      };
    }
  };

  const spacing = getSpacing();

  return (
    <div
      ref={slideRef}
      className={cn(
        "process-slide w-full flex items-center justify-center flex-shrink-0 relative",
        isVerticalLayout 
          ? `min-h-screen ${spacing.container} ${spacing.section}` 
          : "h-screen"
      )}
    >
      {/* Hero slide - First slide */}
      {isHeroSlide && (
        <div className="text-center w-full max-w-6xl mx-auto">
          <motion.h1 
            className={cn(
              "font-black leading-[0.85] mb-1 xs:mb-2 sm:mb-3 md:mb-4 text-gray-900",
              getHeroTitleSize()
            )}
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {step.title}
          </motion.h1>
          <motion.h1 
            className={cn(
              "font-black leading-[0.85] text-blue-600",
              getHeroTitleSize()
            )}
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {step.subtitle}
          </motion.h1>
          <motion.p
            className={cn(
              "text-gray-600 mt-4 xs:mt-5 sm:mt-6 md:mt-8 max-w-4xl mx-auto leading-relaxed",
              getDescriptionSize()
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {step.description}
          </motion.p>
        </div>
      )}

      {/* Process steps */}
      {!isHeroSlide && (
        <>
          {isVerticalLayout ? (
            /* Mobile/Tablet Layout */
            <div className={cn(
              "w-full text-center flex flex-col items-center max-w-2xl mx-auto step-content",
              spacing.elementGap
            )}>
              
              {/* Main Step Title - Large and Prominent */}
              <div className={cn("animate-element", spacing.titleGap)}>
                <motion.h2 
                  className={cn(
                    "font-black text-gray-900 tracking-tight leading-none",
                    getStepTitleSize()
                  )}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h2>
                <motion.h3 
                  className={cn(
                    "font-bold text-blue-600 tracking-tight leading-tight",
                    getStepSubtitleSize()
                  )}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {step.subtitle}
                </motion.h3>
              </div>

              {/* Step Icon */}
              <div className="relative animate-element">
                <div className={cn(
                  "bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl",
                  getIconSize()
                )}>
                  {step.icon}
                </div>
                <div className={cn(
                  "absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-blue-100 shadow-lg",
                  screenSize === 'xs' ? 'w-5 h-5 text-xs' : 
                  screenSize === 'sm' ? 'w-6 h-6 text-xs' :
                  'w-7 h-7 xs:w-8 xs:h-8 text-sm'
                )}>
                  {stepNumber}
                </div>
              </div>

              {/* Description */}
              <motion.p 
                className={cn(
                  "text-gray-600 leading-relaxed max-w-lg animate-element",
                  getDescriptionSize(),
                  screenSize === 'xs' ? 'px-1' : 'px-2 xs:px-4'
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {step.description}
              </motion.p>

              {/* Image */}
              <div className={cn(
                "w-full step-image animate-element",
                getImageMaxWidth()
              )}>
                {step.images.main && (
                  <img
                    src={step.images.main}
                    alt={`${step.title} - ${step.subtitle}`}
                    className={cn(
                      "w-full h-auto object-contain shadow-2xl",
                      screenSize === 'xs' ? 'rounded-lg' : 
                      screenSize === 'sm' ? 'rounded-xl' :
                      'rounded-xl xs:rounded-2xl'
                    )}
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', step.images.main);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', step.images.main);
                    }}
                  />
                )}
                {!step.images.main && (
                  <div className={cn(
                    "w-full bg-gray-200 shadow-2xl flex items-center justify-center text-gray-500",
                    screenSize === 'xs' ? 'h-48 rounded-lg' : 
                    screenSize === 'sm' ? 'h-56 rounded-xl' :
                    'h-64 rounded-xl xs:rounded-2xl'
                  )}>
                    <span className="text-sm">Image placeholder</span>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className={cn(
                "flex items-center justify-center animate-element",
                screenSize === 'xs' ? 'space-x-1 mt-3' : 'space-x-2 xs:space-x-3 mt-4 xs:mt-6'
              )}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-full transition-all duration-500 ease-out",
                      screenSize === 'xs' ? 'w-1 h-1' : 
                      screenSize === 'sm' ? 'w-1.5 h-1.5' :
                      'w-2 h-2 sm:w-3 sm:h-3',
                      i === stepNumber - 1
                        ? "bg-blue-500 scale-150 shadow-lg" 
                        : i < stepNumber - 1 
                          ? "bg-blue-300" 
                          : "bg-gray-300"
                    )}
                  />
                ))}
                <span className={cn(
                  "font-semibold text-gray-500",
                  screenSize === 'xs' ? 'ml-1 text-xs' : 
                  screenSize === 'sm' ? 'ml-2 text-xs' :
                  'ml-2 xs:ml-4 text-xs sm:text-sm'
                )}>
                  {stepNumber} of {totalSteps}
                </span>
              </div>
            </div>
          ) : (
            /* Desktop Layout - Fixed for better image visibility */
            <div className="w-full h-full flex items-center relative px-12 max-w-7xl mx-auto">
              {/* Text Content - Left Side */}
              <div className="w-1/2 flex flex-col justify-center step-content pr-8">
                {/* Step Icon */}
                <div className="flex items-center justify-start mb-6">
                  <div className="relative">
                    <div className={cn(
                      "bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl",
                      getIconSize()
                    )}>
                      {step.icon}
                    </div>
                    <div className={cn(
                      "absolute -top-2 -right-2 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold border-3 border-blue-100 shadow-lg",
                      screenSize === 'xl' ? 'w-7 h-7 text-sm' : 'w-8 h-8 xl:w-9 xl:h-9 text-base'
                    )}>
                      {stepNumber}
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <div className="mb-6">
                  <motion.h2 
                    className={cn(
                      "font-black text-gray-900 tracking-tight mb-3 leading-none",
                      screenSize === 'xl' ? 'text-4xl' :
                      screenSize === '2xl' ? 'text-5xl' :
                      'text-6xl'
                    )}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    {step.title}
                  </motion.h2>
                  <motion.h3 
                    className={cn(
                      "font-bold text-blue-600 tracking-tight",
                      screenSize === 'xl' ? 'text-2xl' :
                      screenSize === '2xl' ? 'text-3xl' :
                      'text-4xl'
                    )}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {step.subtitle}
                  </motion.h3>
                </div>

                {/* Description */}
                <motion.p 
                  className={cn(
                    "text-gray-600 leading-relaxed max-w-xl mb-8",
                    getDescriptionSize()
                  )}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  {step.description}
                </motion.p>

                {/* Progress Indicator */}
                <div className="flex items-center space-x-3">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-full transition-all duration-500 ease-out",
                        screenSize === 'xl' ? 'w-3 h-3' : 'w-3 h-3 xl:w-4 xl:h-4',
                        i === stepNumber - 1
                          ? "bg-blue-500 scale-150 shadow-lg" 
                          : i < stepNumber - 1 
                            ? "bg-blue-300" 
                            : "bg-gray-300"
                      )}
                    />
                  ))}
                  <span className={cn(
                    "ml-4 font-semibold text-gray-500",
                    screenSize === 'xl' ? 'text-lg' : 'text-lg xl:text-xl'
                  )}>
                    {stepNumber} of {totalSteps}
                  </span>
                </div>
              </div>

              {/* Image - Right Side - Fixed positioning and sizing */}
              <div className="w-1/2 flex items-center justify-center step-image">
                <div className={cn(
                  "relative w-full max-w-lg h-auto opacity-100",
                  screenSize === 'xl' ? 'max-w-md' :
                  screenSize === '2xl' ? 'max-w-lg' :
                  'max-w-xl'
                )}
                style={{ opacity: 1, visibility: 'visible' }}
                >
                  {step.images.main ? (
                    <img
                      src={step.images.main}
                      alt={`${step.title} - ${step.subtitle}`}
                      className="w-full h-auto object-contain rounded-2xl xl:rounded-3xl shadow-2xl opacity-100"
                      loading="eager"
                      style={{ 
                        display: 'block',
                        maxHeight: '70vh',
                        width: 'auto',
                        margin: '0 auto',
                        opacity: 1,
                        visibility: 'visible'
                      }}
                      onError={(e) => {
                        console.error('Desktop image failed to load:', step.images.main);
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        // Show fallback
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                      onLoad={(e) => {
                        console.log('Desktop image loaded successfully:', step.images.main);
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.opacity = '1';
                        target.style.visibility = 'visible';
                      }}
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 rounded-2xl xl:rounded-3xl shadow-2xl flex items-center justify-center text-gray-500">
                      <span className="text-lg">Image placeholder</span>
                    </div>
                  )}
                  {/* Fallback div for failed images */}
                  <div 
                    className="w-full h-96 bg-gray-200 rounded-2xl xl:rounded-3xl shadow-2xl items-center justify-center text-gray-500"
                    style={{ display: 'none' }}
                  >
                    <span className="text-lg">Image not available</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Enhanced debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default ProcessSection;