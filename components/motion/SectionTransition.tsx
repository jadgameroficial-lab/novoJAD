"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Section-level entrance used to give scrolling the site a continuous, composed
 * feel: content rises out of a soft blur behind a clip mask instead of popping in.
 * Uses Motion's viewport observer (IntersectionObserver under the hood), never a
 * scroll listener.
 */
export function SectionTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 56, filter: "blur(12px)", clipPath: "inset(12% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1.05, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
