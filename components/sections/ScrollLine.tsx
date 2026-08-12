"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const PATH_D = "M 100 0 C 160 80, 40 160, 100 240 C 160 320, 40 400, 100 480 C 160 560, 40 640, 100 720";

export function ScrollLine({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className={className}>
      <svg viewBox="0 0 200 720" fill="none" aria-hidden="true" className="h-full w-full">
        <path d={PATH_D} stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
        <motion.path d={PATH_D} stroke="currentColor" strokeWidth={2} style={{ pathLength }} />
      </svg>
    </div>
  );
}
