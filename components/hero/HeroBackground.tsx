"use client";

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Atmosphere layer only: deep-space noise plus the soft violet/blue bloom that
 * sits behind everything. The giant wordmark and the 3D core are composed in
 * Hero.tsx, where their stacking order relative to each other matters.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(139,92,246,0.20), transparent 70%), radial-gradient(ellipse 45% 40% at 62% 62%, rgba(79,127,255,0.14), transparent 65%), radial-gradient(ellipse 40% 35% at 35% 30%, rgba(168,85,247,0.10), transparent 70%)",
        }}
      />
    </div>
  );
}
