"use client";

import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

// Apple's "critically damped by default, bounce only for momentum" spring rule
// (damping 1.0, response ~0.3-0.4s), applied via Motion's whileHover/whileTap so
// press feedback lands on pointer-down and every reversal starts from the live
// on-screen value instead of resetting.
const springTransition = { type: "spring" as const, bounce: 0, duration: 0.35 };

export function SpringLink({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof motion.a>) {
  return (
    <motion.a
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={springTransition}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function SpringButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <motion.button
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={springTransition}
      {...props}
    >
      {children}
    </motion.button>
  );
}
