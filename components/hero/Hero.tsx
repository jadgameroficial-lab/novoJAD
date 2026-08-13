"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { content } from "@/lib/content";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpringLink } from "@/components/motion/SpringPress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HeroBackground } from "./HeroBackground";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { badge, headline, subheadline, primaryCta, secondaryCta } = content.hero;
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  // Mouse parallax on the giant background wordmark. Applied imperatively via a
  // direct style write (no React state) so it never triggers a re-render on move.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const bgText = bgTextRef.current;
    if (!section || !bgText) return;
    const handleMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      bgText.style.transform = `translate3d(${nx * -18}px, ${ny * -14}px, 0)`;
    };
    section.addEventListener("pointermove", handleMove);
    return () => section.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  // Cinematic scroll-out: as the hero scrolls past, it scales down, dims, and
  // drifts up to reveal the next section.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const wrap = sceneWrapRef.current;
    if (!section || !wrap) return;
    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        scale: 0.88,
        y: -60,
        filter: "brightness(0.5)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050505] pt-24"
    >
      <div ref={sceneWrapRef} className="absolute inset-0">
        <HeroBackground ref={bgTextRef} text="JAD" />
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.85, filter: "blur(24px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: ENTRANCE_EASE }}
          className="absolute inset-0"
        >
          <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} />
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(5,5,5,0.6) 85%), linear-gradient(to bottom, rgba(5,5,5,0.4), transparent 20%, transparent 70%, rgba(5,5,5,0.92))",
        }}
      />
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: ENTRANCE_EASE }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <p className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-jad-accent" />
          {badge}
        </p>
        <SplitReveal as="h1" className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {headline}
        </SplitReveal>
        <p className="mx-auto mt-6 max-w-xl text-fg-muted">{subheadline}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <SpringLink
            href={primaryCta.href}
            className="rounded-pill border border-line px-6 py-3 text-sm font-medium text-foreground"
          >
            {primaryCta.label}
          </SpringLink>
          <SpringLink
            href={secondaryCta.href}
            className="rounded-pill bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            {secondaryCta.label}
          </SpringLink>
        </div>
      </motion.div>
    </section>
  );
}
