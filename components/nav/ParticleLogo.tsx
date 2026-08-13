"use client";

import { useEffect, useRef } from "react";
import { jadWordmarkFont } from "@/lib/fonts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Interactive particle logo. Samples a text glyph (the JAD wordmark) onto an
 * offscreen canvas, turns each opaque pixel into a particle, then animates
 * those particles with a direct ImageData buffer writer (faster than per-particle
 * canvas draw calls at particle counts in the hundreds). Ported from a reference
 * "SVG/image to particles" engine and retargeted from image sampling to text
 * sampling, since the source is always our own wordmark, not an uploaded image.
 */

type RoamShape = "rectangle" | "circle" | "oval";
type HoverType = "roam" | "hide";
type HideType = "in-place" | "scatter";
type RepulsionMode = "outside" | "random";
type ParticleShape = "circle" | "square" | "both";
type ParticleColorMode = "sampled" | "single" | "multi";
type AnimState = "active" | "assembling" | "idle" | "scattering";
type EaseName = "easeOut" | "easeInOut" | "easeIn" | "backOut" | "circOut" | "linear";

interface Transition {
  type?: "spring" | "tween";
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  ease?: EaseName;
}

interface HoverConfig {
  hoverType?: HoverType;
  transition?: Transition;
  roamWidth?: number;
  roamHeight?: number;
  roamOpacity?: number;
  roamShape?: RoamShape;
  hideType?: HideType;
}

interface RepulsionConfig {
  repulsionForce?: number;
  repulsionRadius?: number;
  repulsionMode?: RepulsionMode;
}

export interface ParticleLogoProps {
  text?: string;
  width: number;
  height: number;
  particleCount?: number;
  particleSize?: number;
  particleShape?: ParticleShape;
  particleColor?: ParticleColorMode;
  singleColor?: string;
  multiColors?: string[];
  hoverEnabled?: boolean;
  hoverConfig?: HoverConfig;
  repulsionEnabled?: boolean;
  repulsionConfig?: RepulsionConfig;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  repX: number;
  repY: number;
  repTargetX: number;
  repTargetY: number;
  homeX: number;
  homeY: number;
  idleX: number;
  idleY: number;
  roamTargetX: number;
  roamTargetY: number;
  r: number;
  g: number;
  b: number;
  a: number;
  isPadding: boolean;
  inZone: boolean;
  colorIdx: number;
}

const EASE: Record<EaseName, (t: number) => number> = {
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)),
  easeIn: (t) => t * t,
  backOut: (t) => 1 + (1.70158 + 1) * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
  circOut: (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
  linear: (t) => t,
};

function getTransitionParams(tr?: Transition) {
  if (!tr) return { easeFn: EASE.easeOut, durMs: 800 };
  if (tr.type === "spring") {
    const k = tr.stiffness ?? 100;
    const d = tr.damping ?? 15;
    const m = tr.mass ?? 1;
    const durMs = Math.min(3000, Math.max(300, (d / (2 * Math.sqrt(k * m))) * 2000));
    return { easeFn: EASE.backOut, durMs };
  }
  return { easeFn: EASE[tr.ease ?? "easeOut"], durMs: (tr.duration ?? 0.8) * 1000 };
}

function parseColor(c: string) {
  const m = c.match(/rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/);
  if (m) {
    return {
      r: +m[1] | 0,
      g: +m[2] | 0,
      b: +m[3] | 0,
      a: m[4] != null ? Math.round(+m[4] * 255) : 255,
    };
  }
  const h = c.replace("#", "");
  if (h.length >= 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255,
    };
  }
  return { r: 245, g: 245, b: 245, a: 255 };
}

function randomInShape(shape: RoamShape, bx: number, by: number, bw: number, bh: number): [number, number] {
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  if (shape === "circle") {
    const r = bw / 2;
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random()) * r;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  }
  if (shape === "oval") {
    const rx = bw / 2;
    const ry = bh / 2;
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random());
    return [cx + d * rx * Math.cos(a), cy + d * ry * Math.sin(a)];
  }
  return [bx + Math.random() * bw, by + Math.random() * bh];
}

function mkParticle(homeX: number, homeY: number, r: number, g: number, b: number, a: number, x: number, y: number): Particle {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    startX: x,
    startY: y,
    repX: 0,
    repY: 0,
    repTargetX: 0,
    repTargetY: 0,
    homeX,
    homeY,
    idleX: x,
    idleY: y,
    roamTargetX: 0,
    roamTargetY: 0,
    r,
    g,
    b,
    a,
    isPadding: false,
    inZone: false,
    colorIdx: Math.floor(Math.random() * 10),
  };
}

export function ParticleLogo({
  text = "JAD",
  width,
  height,
  particleCount = 110,
  particleSize = 3,
  particleShape = "circle",
  particleColor = "sampled",
  singleColor,
  multiColors = [],
  hoverEnabled = false,
  hoverConfig = {},
  repulsionEnabled = true,
  repulsionConfig = {},
  className,
}: ParticleLogoProps) {
  const {
    hoverType = "roam",
    transition,
    roamWidth = 0,
    roamHeight = 0,
    roamOpacity = 0.5,
    roamShape = "rectangle",
    hideType = "scatter",
  } = hoverConfig;
  const { repulsionForce = 6, repulsionRadius = 34, repulsionMode = "outside" } = repulsionConfig;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -99999, y: -99999, active: false });
  const prevMouseRef = useRef({ x: -99999, y: -99999 });
  const mouseSpeedRef = useRef(0);
  const smoothMouseRef = useRef({ x: -99999, y: -99999 });
  const sceneRef = useRef<{ particles: Particle[] }>({ particles: [] });
  const dimsRef = useRef({ W: width, H: height });
  const animStateRef = useRef<AnimState>(hoverEnabled ? "idle" : "active");
  const animRef = useRef(0);
  const animStartTimeRef = useRef(0);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const roamFadeStartRef = useRef(0);
  const roamFadeFromRef = useRef(1);
  const roamFadeToRef = useRef(1);
  const reducedMotion = usePrefersReducedMotion();

  const startAnim = (newState: "assembling" | "scattering") => {
    const { particles } = sceneRef.current;
    const { W, H } = dimsRef.current;
    const bw = Math.max(80, roamWidth || W);
    const bh = Math.max(80, roamHeight || H);
    const bx = (W - bw) / 2;
    const by = (H - bh) / 2;

    particles.forEach((p) => {
      p.startX = p.x;
      p.startY = p.y;
      if (newState === "scattering" && hoverType === "roam") {
        const [tx, ty] = randomInShape(roamShape, bx, by, bw, bh);
        p.roamTargetX = tx;
        p.roamTargetY = ty;
        p.idleX = tx;
        p.idleY = ty;
      }
    });

    if (hoverType === "roam") {
      if (newState === "scattering") {
        roamFadeStartRef.current = Date.now();
        roamFadeFromRef.current = 1;
        roamFadeToRef.current = roamOpacity;
      } else {
        roamFadeStartRef.current = Date.now();
        roamFadeFromRef.current = roamOpacity;
        roamFadeToRef.current = 1;
      }
    }

    if (newState === "scattering" && hoverType === "roam") {
      clearTimeout(animTimerRef.current);
      animStateRef.current = "idle";
      return;
    }

    const { durMs } = getTransitionParams(transition);
    animStartTimeRef.current = Date.now();
    animStateRef.current = newState;
    clearTimeout(animTimerRef.current);
    const next: AnimState = newState === "assembling" ? "active" : "idle";
    animTimerRef.current = setTimeout(() => {
      if (animStateRef.current === newState) animStateRef.current = next;
    }, durMs);
  };

  // Build the particle formation by sampling the wordmark text onto an offscreen canvas.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const { W, H } = dimsRef.current;
      const sample = document.createElement("canvas");
      sample.width = W;
      sample.height = H;
      const sctx = sample.getContext("2d");
      if (!sctx) return;
      sctx.clearRect(0, 0, W, H);
      sctx.fillStyle = "#ffffff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.font = `400 ${H * 0.86}px ${jadWordmarkFont.style.fontFamily}`;
      sctx.fillText(text, W / 2, H / 2 + H * 0.03);
      const { data } = sctx.getImageData(0, 0, W, H);

      const gap = Math.max(1, Math.round(150 / Math.max(1, particleCount)));
      const bw = Math.max(80, roamWidth || W);
      const bh = Math.max(80, roamHeight || H);
      const bx = (W - bw) / 2;
      const by = (H - bh) / 2;

      const particles: Particle[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const i = (y * W + x) * 4;
          if (data[i + 3] < 20) continue;
          const startPos: [number, number] = hoverEnabled
            ? hoverType === "roam"
              ? randomInShape(roamShape, bx, by, bw, bh)
              : [x, y]
            : [x, y];
          const p = mkParticle(x, y, data[i], data[i + 1], data[i + 2], data[i + 3], startPos[0], startPos[1]);
          if (hoverEnabled && hoverType === "roam") {
            const [tx, ty] = randomInShape(roamShape, bx, by, bw, bh);
            p.roamTargetX = tx;
            p.roamTargetY = ty;
            p.vx = (Math.random() - 0.5) * 1.2;
            p.vy = (Math.random() - 0.5) * 1.2;
          }
          particles.push(p);
        }
      }
      sceneRef.current = { particles };
    });
    return () => {
      cancelled = true;
    };
  }, [text, width, height, particleCount, hoverEnabled, hoverType, roamShape, roamWidth, roamHeight]);

  // Render loop: writes particles straight into an ImageData buffer each frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    dimsRef.current = { W: width, H: height };

    const resolvedColor = parseColor(getComputedStyle(canvas).color || "#f5f5f5");
    const single = singleColor ? parseColor(singleColor) : resolvedColor;

    if (reducedMotion) {
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${single.r}, ${single.g}, ${single.b})`;
      for (const p of sceneRef.current.particles) {
        ctx.beginPath();
        ctx.arc(p.homeX, p.homeY, particleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    let idata: ImageData | null = null;
    let bW = 0;
    let bH = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const PW = canvas.width;
      const PH = canvas.height;
      if (!PW || !PH) return;
      const { particles } = sceneRef.current;
      if (!particles.length) return;
      if (!idata || PW !== bW || PH !== bH) {
        idata = ctx.createImageData(PW, PH);
        bW = PW;
        bH = PH;
      }
      idata.data.fill(0);
      const buf = idata.data;

      const state = animStateRef.current;
      const { x: rawMx, y: rawMy, active } = mouseRef.current;
      const hitSpeed = mouseSpeedRef.current;
      mouseSpeedRef.current *= 0.88;

      const sm = smoothMouseRef.current;
      if (active) {
        const lerpFactor = Math.max(0.08, 0.3 - hitSpeed * 0.006);
        if (sm.x < -9000) {
          sm.x = rawMx;
          sm.y = rawMy;
        } else {
          sm.x += (rawMx - sm.x) * lerpFactor;
          sm.y += (rawMy - sm.y) * lerpFactor;
        }
      } else {
        sm.x = -99999;
        sm.y = -99999;
      }
      const mx = sm.x;
      const my = sm.y;

      const ps = Math.max(1, Math.ceil((particleSize / 4) * dpr));
      const half = ps / 2;
      const { easeFn, durMs } = getTransitionParams(transition);
      const elapsed = Date.now() - animStartTimeRef.current;
      const animT = easeFn(Math.min(1, elapsed / durMs));

      const { W: DW, H: DH } = dimsRef.current;
      const bw = Math.max(80, roamWidth || DW);
      const bh = Math.max(80, roamHeight || DH);
      const bx = (DW - bw) / 2;
      const by = (DH - bh) / 2;

      const drawParticle = (cx: number, cy: number, r: number, g: number, b: number, a: number, isCircle: boolean) => {
        const px0 = Math.round(cx) - (ps >> 1);
        const py0 = Math.round(cy) - (ps >> 1);
        for (let dy = 0; dy < ps; dy++) {
          const iy = py0 + dy;
          if (iy < 0 || iy >= PH) continue;
          const row = iy * PW;
          for (let dx = 0; dx < ps; dx++) {
            if (isCircle) {
              const ddx = dx - half + 0.5;
              const ddy = dy - half + 0.5;
              if (ddx * ddx + ddy * ddy > half * half) continue;
            }
            const ix = px0 + dx;
            if (ix < 0 || ix >= PW) continue;
            const i = (row + ix) * 4;
            buf[i] = r;
            buf[i + 1] = g;
            buf[i + 2] = b;
            buf[i + 3] = a;
          }
        }
      };

      const repCutoff = Math.max(1, repulsionRadius);
      const repCutoffSq = repCutoff * repCutoff;
      let pIdx = 0;

      for (const p of particles) {
        const isCircle = particleShape === "circle" || (particleShape === "both" && pIdx % 2 === 1);
        pIdx++;

        let baseX = p.x;
        let baseY = p.y;
        if (state === "assembling") {
          baseX = p.startX + (p.homeX - p.startX) * animT;
          baseY = p.startY + (p.homeY - p.startY) * animT;
        } else if (state === "scattering") {
          baseX = p.startX + (p.idleX - p.startX) * animT;
          baseY = p.startY + (p.idleY - p.startY) * animT;
        } else if (state === "active") {
          baseX = p.homeX;
          baseY = p.homeY;
        } else if (state === "idle") {
          if (hoverType === "roam") {
            const dtx = p.roamTargetX - p.x;
            const dty = p.roamTargetY - p.y;
            if (Math.hypot(dtx, dty) < 3) {
              const [tx, ty] = randomInShape(roamShape, bx, by, bw, bh);
              p.roamTargetX = tx;
              p.roamTargetY = ty;
            }
            p.vx = p.vx * 0.98 + (p.roamTargetX - p.x) * 0.003;
            p.vy = p.vy * 0.98 + (p.roamTargetY - p.y) * 0.003;
            const sp = Math.hypot(p.vx, p.vy);
            if (sp > 1.5) {
              p.vx = (p.vx / sp) * 1.5;
              p.vy = (p.vy / sp) * 1.5;
            }
            p.x += p.vx;
            p.y += p.vy;
            baseX = p.x;
            baseY = p.y;
          } else {
            baseX = p.idleX;
            baseY = p.idleY;
          }
        }

        if (repulsionEnabled) {
          if (repulsionMode === "random") {
            const dx = baseX - rawMx;
            const dy = baseY - rawMy;
            const dist = Math.hypot(dx, dy);
            if (dist < repCutoff) {
              if (!p.inZone) {
                const angle = Math.random() * Math.PI * 2;
                const d = Math.random() * repulsionForce * 5;
                p.repTargetX = Math.cos(angle) * d;
                p.repTargetY = Math.sin(angle) * d;
                p.inZone = true;
              }
              p.repX += (p.repTargetX - p.repX) * 0.15;
              p.repY += (p.repTargetY - p.repY) * 0.15;
            } else {
              p.inZone = false;
            }
          } else if (active) {
            const dx = baseX - mx;
            const dy = baseY - my;
            const distSq = dx * dx + dy * dy;
            if (distSq > 0 && distSq < repCutoffSq) {
              const dist = Math.sqrt(distSq);
              const nx = dx / dist;
              const ny = dy / dist;
              const falloff = 1 - dist / repCutoff;
              const push = falloff * hitSpeed * repulsionForce * 0.05;
              p.repX += nx * push;
              p.repY += ny * push;
              const targetRepX = nx * (repCutoff - dist);
              const targetRepY = ny * (repCutoff - dist);
              p.repX += (targetRepX - p.repX) * 0.06;
              p.repY += (targetRepY - p.repY) * 0.06;
              p.inZone = true;
            } else {
              p.inZone = false;
            }
          } else {
            p.inZone = false;
          }
        } else {
          p.inZone = false;
        }

        if (!p.inZone) {
          p.repX *= 0.97;
          p.repY *= 0.97;
        }
        p.x = baseX + p.repX;
        p.y = baseY + p.repY;

        let dr = p.r;
        let dg = p.g;
        let db = p.b;
        let da = p.a;

        if (state !== "active") {
          if (hoverType === "roam" && hoverEnabled) {
            let alphaMul: number;
            if (roamFadeStartRef.current === 0) {
              alphaMul = roamOpacity;
            } else {
              const fadeElapsed = Date.now() - roamFadeStartRef.current;
              const fadeT = Math.min(1, Math.max(0, fadeElapsed / durMs));
              const easedFadeT = easeFn(fadeT);
              alphaMul = roamFadeFromRef.current + (roamFadeToRef.current - roamFadeFromRef.current) * easedFadeT;
            }
            da = Math.round(p.a * alphaMul);
          } else if (hideType === "scatter" || hideType === "in-place") {
            let alphaMul: number;
            if (state === "idle") alphaMul = 0;
            else if (state === "assembling") alphaMul = animT;
            else if (state === "scattering") alphaMul = 1 - animT;
            else alphaMul = 1;
            da = Math.round(p.a * alphaMul);
          }
        }

        if (da < 1) continue;

        if (particleColor === "single") {
          dr = single.r;
          dg = single.g;
          db = single.b;
        } else if (particleColor === "multi") {
          const cols = multiColors.filter(Boolean);
          if (cols.length > 0) {
            const mc = parseColor(cols[p.colorIdx % cols.length]);
            dr = mc.r;
            dg = mc.g;
            db = mc.b;
          }
        } else {
          dr = single.r;
          dg = single.g;
          db = single.b;
        }

        drawParticle(p.x * dpr, p.y * dpr, dr, dg, db, da, isCircle);
      }

      ctx.putImageData(idata, 0, 0);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [
    width,
    height,
    particleSize,
    particleShape,
    particleColor,
    singleColor,
    multiColors,
    hoverEnabled,
    hoverType,
    transition,
    roamWidth,
    roamHeight,
    roamOpacity,
    roamShape,
    hideType,
    repulsionEnabled,
    repulsionForce,
    repulsionRadius,
    repulsionMode,
    reducedMotion,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { W, H } = dimsRef.current;
    const scaleX = rect.width > 0 ? W / rect.width : 1;
    const scaleY = rect.height > 0 ? H / rect.height : 1;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const prev = prevMouseRef.current;
    if (prev.x > -9999) {
      mouseSpeedRef.current = Math.hypot(mx - prev.x, my - prev.y);
    }
    prevMouseRef.current = { x: mx, y: my };
    mouseRef.current = { x: mx, y: my, active: true };
    if (hoverEnabled) {
      const s = animStateRef.current;
      if (s === "idle" || s === "scattering") startAnim("assembling");
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current = { x: -99999, y: -99999, active: false };
    if (hoverEnabled) {
      const s = animStateRef.current;
      if (s === "assembling" || s === "active") startAnim("scattering");
    }
  };

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={text}
        style={{ display: "block", width: "100%", height: "100%" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
    </div>
  );
}
