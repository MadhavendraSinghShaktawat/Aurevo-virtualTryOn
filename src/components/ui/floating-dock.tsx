import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  rightSlot,
}: {
  items: { title: string; href?: string; onClick?: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
  rightSlot?: React.ReactNode;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} rightSlot={rightSlot} />
      <FloatingDockMobile items={items} className={mobileClassName} rightSlot={rightSlot} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  rightSlot,
}: {
  items: { title: string; href?: string; onClick?: () => void }[];
  className?: string;
  rightSlot?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden flex items-center gap-3", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-3 flex flex-row gap-3 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-full px-4 py-3 justify-center"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    delay: idx * 0.03,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.03 }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="flex h-11 px-4 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 active:scale-95 cursor-interactive whitespace-nowrap"
                    data-cursor-hover
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="flex h-11 px-4 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 active:scale-95 cursor-interactive whitespace-nowrap"
                    data-cursor-hover
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-lg hover:bg-gray-50 transition-colors active:scale-95 cursor-interactive"
        data-cursor-hover
      >
        <IconLayoutNavbarCollapse className={cn("h-5 w-5 text-gray-600 transition-transform duration-200", open && "rotate-180")} />
        <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
      </button>
      {rightSlot ?? (
        <a
          href="/login"
          className="hidden sm:flex h-12 px-5 rounded-full bg-blue-600 text-white font-medium shadow-lg border border-blue-500/60 hover:bg-blue-700 active:scale-95 transition-all cursor-interactive items-center"
          data-cursor-hover
        >
          Login
        </a>
      )}
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  rightSlot,
}: {
  items: { title: string; href?: string; onClick?: () => void }[];
  className?: string;
  rightSlot?: React.ReactNode;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-center gap-8 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg px-8 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
      <div className="ml-2 h-8 w-px bg-gray-200/70" />
      {rightSlot ?? (
        <a
          href="/login"
          className="h-11 px-5 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:scale-95 transition-all cursor-interactive"
          data-cursor-hover
        >
          Login
        </a>
      )}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  href?: string;
  onClick?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  // Calculate base width based on text content
  const baseWidth = Math.max(80, title.length * 8 + 32); // Minimum 80px, adjust based on text length
  const expandedWidth = baseWidth + 16; // Add 16px when hovered
  
  let widthTransform = useTransform(distance, [-150, 0, 150], [baseWidth, expandedWidth, baseWidth]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [44, 48, 44]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 cursor-interactive px-4"
      data-cursor-hover
    >
      <span className="text-sm font-medium whitespace-nowrap">{title}</span>
      <div data-cursor-bounds className="absolute inset-0 rounded-full"></div>
    </motion.div>
  );

  if (onClick) {
    return <button onClick={onClick}>{content}</button>;
  }
  return <a href={href}>{content}</a>;
}
