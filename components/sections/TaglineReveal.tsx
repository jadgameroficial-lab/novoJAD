"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { content } from "@/lib/content";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

// The mandatory "tagline reveal" moment: a large standalone statement, separate from the
// hero, where each word brightens from a muted tone to full color as it crosses the
// viewport, in reading order, tied to scroll position rather than a fixed-duration timer.
export function TaglineReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.85", "start 0.35"] });
  const words = content.tagline.lines.join(" ").split(" ");

  return (
    <section className="py-24 md:py-32">
      <div ref={containerRef} className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {words.map((word, i) => (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}
