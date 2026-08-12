"use client";

import dynamic from "next/dynamic";
import { content } from "@/lib/content";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SpringLink } from "@/components/motion/SpringPress";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AntigravityField = dynamic(() => import("@/components/hero/AntigravityField").then((m) => m.AntigravityField), {
  ssr: false,
});

export function FinalCta() {
  const { headline, subheadline, cta } = content.finalCta;
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="cta-final" className="relative overflow-hidden py-32 text-center">
      <AntigravityField
        className="absolute inset-0 opacity-40"
        count={isMobile ? 80 : 300}
        reducedMotion={reducedMotion}
        magnetRadius={4}
        ringRadius={10}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={0.5}
        lerpSpeed={0.1}
        autoAnimate
        particleVariance={0}
        depthFactor={0.4}
        pulseSpeed={3}
        fieldStrength={4}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        <SplitReveal as="h2" className="text-3xl font-semibold sm:text-5xl">
          {headline}
        </SplitReveal>
        <p className="mt-4 text-fg-muted">{subheadline}</p>
        <SpringLink
          href={cta.href}
          className="mt-10 inline-block rounded-pill bg-foreground px-8 py-3 text-sm font-medium text-background"
        >
          {cta.label}
        </SpringLink>
        <p className="mt-4 text-xs text-fg-subtle">Sem compromisso. Resposta em até um dia útil.</p>
      </div>
    </section>
  );
}
