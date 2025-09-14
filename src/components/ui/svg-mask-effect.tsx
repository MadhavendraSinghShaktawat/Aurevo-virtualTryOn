"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}: {
  children?: string | React.ReactNode;
  revealText?: string | React.ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<any>({ x: null, y: null });
  const containerRef = useRef<any>(null);
  const updateMousePosition = (e: any) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    containerRef.current.addEventListener("mousemove", updateMousePosition);
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mousemove",
          updateMousePosition,
        );
      }
    };
  }, []);
  let maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-screen overflow-hidden", className)}
      animate={{
        backgroundColor: isHovered ? "#0f172a" : "#f9fafb", // slate-900 to gray-50
      }}
      transition={{
        backgroundColor: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="absolute flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-6xl [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px]"
        animate={{
          maskPosition: `${mousePosition.x - maskSize / 2}px ${
            mousePosition.y - maskSize / 2
          }px`,
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.4, ease: "easeOut" },
          maskPosition: { duration: 0.1, ease: "linear" },
        }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-t from-slate-900/40 via-blue-900/20 to-slate-900/40" />
        <motion.div
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold"
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{
            scale: { duration: 0.3, ease: "easeOut" },
          }}
        >
          {children}
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex h-full w-full items-center justify-center relative"
        animate={{
          scale: isHovered ? 0.98 : 1,
        }}
        transition={{
          scale: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {revealText}
        
        {/* Hover hint */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            opacity: isHovered ? 0 : 1,
            y: isHovered ? 10 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <span>Hover to reveal the magic</span>
            <span className="text-lg">✨</span>
          </p>
        </motion.div>
      </motion.div>
      
      {/* Cursor integration */}
      <div 
        className="absolute inset-0 cursor-interactive"
        data-cursor-hover
      >
        <div data-cursor-bounds className="absolute inset-0"></div>
      </div>
    </motion.div>
  );
};
