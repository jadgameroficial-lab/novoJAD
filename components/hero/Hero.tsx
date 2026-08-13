"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { content } from "@/lib/content";
import { SpringLink } from "@/components/motion/SpringPress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HeroBackground } from "./HeroBackground";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial hero composed in explicit layers, so the 3D core physically occludes
 * the giant wordmark behind it:
 *   z-0  atmosphere (noise + violet bloom)
 *   z-10 giant wordmark
 *   z-20 3D core (pointer-events-none so the copy below stays clickable)
 *   z-30 copy block
 */
export function Hero() {
  const { badge, headline, subheadline, primaryCta, secondaryCta } = content.hero;
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // Mouse parallax on the giant wordmark, written straight to style so pointer
  // movement never triggers a React re-render.
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    if (!section || !wordmark) return;
    const handleMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      wordmark.style.transform = `translate3d(${nx * -26}px, ${ny * -16}px, 0)`;
    };
    section.addEventListener("pointermove", handleMove, { passive: true });
    return () => section.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, isMobile]);

  // Cinematic scroll-out: the whole stage scales down, dims and drifts up as the
  // next section takes over.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const ctx = gsap.context(() => {
      gsap.to(stage, {
        scale: 0.9,
        y: -70,
        filter: "brightness(0.45)",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050505]"
    >
      <div ref={stageRef} className="absolute inset-0">
        <HeroBackground />

        {/* Giant wordmark, sitting behind the core */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2" aria-hidden="true">
          <motion.div
            ref={wordmarkRef}
            initial={reducedMotion ? undefined : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="will-change-transform"
          >
            <span
              className="block text-center font-sans font-black uppercase leading-none text-[#e9e6f2]"
              style={{ fontSize: "clamp(3.5rem, 15.5vw, 15rem)", letterSpacing: "-0.055em" }}
            >
              Inteligente
            </span>
          </motion.div>
        </div>

        {/* 3D core, in front of the wordmark */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.86, filter: "blur(26px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: EASE }}
          className="pointer-events-none absolute inset-0 z-20"
        >
          <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} />
        </motion.div>
      </div>

      {/* Vignette so the copy stays legible over the bloom */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, transparent 22%, transparent 55%, rgba(5,5,5,0.88) 92%)",
        }}
      />

      {/* Copy, bottom-left editorial block */}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        className="absolute inset-x-0 bottom-0 z-30 px-6 pb-14 md:px-10 md:pb-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-fg-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-jad-accent" />
              {badge}
            </p>
            <h1 className="mt-5 text-2xl font-medium leading-tight tracking-tight text-foreground sm:text-3xl">
              {headline}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">{subheadline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </motion.div>
    </section>
  );
}
