"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function FadeInStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

const hoverSpring = { type: "spring" as const, bounce: 0, duration: 0.35 };

export function FadeInItem({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds a critically-damped spring lift on hover, for cards a user can click into. */
  hover?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={item}
      {...(hover
        ? { whileHover: { y: -6, scale: 1.01 }, whileTap: { scale: 0.99 }, transition: hoverSpring }
        : {})}
    >
      {children}
    </motion.div>
  );
}
