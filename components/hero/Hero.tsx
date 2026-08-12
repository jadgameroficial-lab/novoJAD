"use client";

import dynamic from "next/dynamic";
import { content } from "@/lib/content";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpringLink } from "@/components/motion/SpringPress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

const AntigravityField = dynamic(() => import("./AntigravityField").then((m) => m.AntigravityField), {
  ssr: false,
});

export function Hero() {
  const { badge, headline, subheadline, primaryCta, secondaryCta } = content.hero;
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <AntigravityField
        className="absolute inset-0"
        count={isMobile ? 250 : 1000}
        reducedMotion={reducedMotion}
        magnetRadius={4}
        ringRadius={10}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={0.5}
        lerpSpeed={0.1}
        autoAnimate
        particleVariance={0}
        rotationSpeed={0}
        depthFactor={0.4}
        pulseSpeed={3}
        particleShape="capsule"
        fieldStrength={4}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(10,10,10,0.55) 85%), linear-gradient(to bottom, rgba(10,10,10,0.35), transparent 20%, transparent 75%, rgba(10,10,10,0.85))",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
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
      </div>
    </section>
  );
}
