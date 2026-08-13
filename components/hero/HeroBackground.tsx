"use client";

import { forwardRef } from "react";

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export const HeroBackground = forwardRef<HTMLDivElement, { text?: string }>(function HeroBackground(
  { text = "JAD" },
  ref
) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 48% 42%, rgba(139,92,246,0.16), transparent 55%), radial-gradient(circle at 60% 62%, rgba(79,127,255,0.12), transparent 50%)",
        }}
      />
      <div ref={ref} className="absolute inset-0 flex select-none items-center justify-center will-change-transform">
        <span
          className="font-sans font-black uppercase text-foreground/[0.14]"
          style={{ fontSize: "clamp(6rem, 24vw, 22rem)", letterSpacing: "-0.05em", lineHeight: 1 }}
        >
          {text}
        </span>
      </div>
    </div>
  );
});
