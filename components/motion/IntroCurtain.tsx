"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { jadWordmarkFont } from "@/lib/fonts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const EASE = [0.72, 0, 0.24, 1] as const;
const LIFT_AT = 1250;
const HARD_REMOVE_AT = 2600;

/**
 * First-load curtain: a full-bleed panel carrying the JAD wordmark that lifts
 * away once the page is ready, so the hero is revealed rather than just appearing.
 *
 * Two safeguards keep a stalled animation from ever trapping the page behind it
 * (which can happen if the tab is backgrounded during load, since browsers stall
 * animation frames there): the panel never accepts pointer events, and a hard
 * timer unmounts it regardless of whether the exit animation finished.
 */
export function IntroCurtain() {
  const reducedMotion = usePrefersReducedMotion();
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Timer subscriptions only; setState happens in the callbacks, never
  // synchronously in the effect body (React Compiler's set-state-in-effect rule).
  useEffect(() => {
    const lift = setTimeout(() => setDone(true), LIFT_AT);
    const remove = setTimeout(() => setRemoved(true), HARD_REMOVE_AT);
    return () => {
      clearTimeout(lift);
      clearTimeout(remove);
    };
  }, []);

  useEffect(() => {
    if (done || removed || reducedMotion) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [done, removed, reducedMotion]);

  if (reducedMotion || removed) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro-curtain"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden="true"
        >
          <motion.span
            className={`${jadWordmarkFont.className} text-4xl text-foreground`}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            JAD
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
