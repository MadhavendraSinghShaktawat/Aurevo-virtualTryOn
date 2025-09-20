'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { Download, Upload, MousePointer, Sparkles } from 'lucide-react';

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
    id: 1,
    title: "Download",
    subtitle: "Get Started",
    description: "Install the Aurevo Chrome extension from the Chrome Web Store. It's free and takes just one click.",
    icon: <Download className="w-8 h-8 md:w-12 md:h-12" />,
    images: {
      main: "/process section/Screenshot 2025-09-20 140113.png"
    }
  },
  {
    id: 2,
    title: "Upload",
    subtitle: "Your Photo",
    description: "Login to your account and upload your photo. Our AI will analyze your body shape for the perfect fit.",
    icon: <Upload className="w-8 h-8 md:w-12 md:h-12" />,
    images: {
      main: "/process section/Screenshot 2025-09-20 140216.png"
    }
  },
  {
    id: 3,
    title: "Try-On",
    subtitle: "Any Outfit",
    description: "Right-click on any clothing item and select 'Try on with Aurevo'. Watch the magic happen instantly.",
    icon: <MousePointer className="w-8 h-8 md:w-12 md:h-12" />,
    images: {
      main: "/process section/Screenshot 2025-09-20 140255.png"
    }
  },
  {
    id: 4,
    title: "Perfect",
    subtitle: "Results",
    description: "See how the outfit looks on you with realistic fit and styling. Make confident purchase decisions.",
    icon: <Sparkles className="w-8 h-8 md:w-12 md:h-12" />,
    images: {
      main: "/process section/aurevo-tryon-1758357271416.png"
    }
  }
];

export function ProcessSection({ className }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !slidesRef.current) return;

    // Horizontal scroll animation
    const slides = slidesRef.current.querySelectorAll('.process-slide');
    
    gsap.to(slides, {
      xPercent: -100 * (slides.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: slidesRef.current,
      }
    });

    // Animate step content
    slides.forEach((slide, index) => {
      const stepContent = slide.querySelector('.step-content');
      const stepImage = slide.querySelector('.step-image');
      
      if (stepContent && stepImage) {
        gsap.fromTo(stepContent, 
          {
            y: 100,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: slide,
              start: "left center",
              end: "right center",
              scrub: 1,
            }
          }
        );

        gsap.fromTo(stepImage, 
          {
            scale: 0.8,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: slide,
              start: "left center",
              end: "right center",
              scrub: 1,
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "w-full h-[400vh] relative bg-white",
        className
      )}
    >
      <div 
        ref={slidesRef}
        className="overflow-hidden sticky top-0 left-0 flex gap-0 w-full h-screen"
      >
        {processData.map((step, index) => (
          <ProcessSlide 
            key={step.id}
            step={step}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

interface ProcessSlideProps {
  step: ProcessSlide;
  index: number;
}

function ProcessSlide({ step, index }: ProcessSlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={slideRef}
      className="process-slide w-full h-screen flex items-center justify-center flex-shrink-0 relative"
    >
      {/* First slide - Hero text */}
      {index === 0 && (
        <>
          <div className="text-center w-full px-4 sm:px-6 lg:px-8">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-none mb-2 sm:mb-4 text-gray-900"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It
            </motion.h1>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-none text-blue-600"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Works
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Four simple steps to transform your online shopping experience
            </motion.p>
          </div>
        </>
      )}

      {/* Process steps */}
      {index > 0 && (
        <>
          {/* Main content - Left side to avoid image overlap */}
          <div className="w-1/2 px-4 sm:px-6 lg:px-8 text-left relative z-20 flex flex-col justify-center">
            {/* Step Number with Icon */}
            <div className="flex items-center justify-start mb-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-100">
                  {step.id}
                </div>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="mb-8">
              <motion.h3 
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-gray-900 tracking-tight mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {step.title}
              </motion.h3>
              <motion.h4 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 tracking-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {step.subtitle}
              </motion.h4>
            </div>

            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-lg mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {step.description}
            </motion.p>

            {/* Step Indicator */}
            <div className="flex items-center justify-start space-x-2">
              {Array.from({ length: processData.length - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300",
                    i === index - 1 
                      ? "bg-blue-500 scale-125" 
                      : i < index - 1 
                        ? "bg-blue-300" 
                        : "bg-gray-300"
                  )}
                />
              ))}
              <span className="ml-4 text-lg font-medium text-gray-500">
                {index} of {processData.length - 1}
              </span>
            </div>
          </div>

          {/* Image positioned to avoid text overlap */}
          <div className="absolute inset-0 z-10 flex items-center justify-end pr-8">
            <div className="relative w-1/2 max-w-2xl">
              <img
                src={step.images.main}
                alt={`${step.title} - ${step.subtitle}`}
                className="w-full h-auto object-contain rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProcessSection
