"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, useGSAP);
}

export function SplitReveal({
  as = "h1",
  className,
  children,
}: {
  as?: "h1" | "h2";
  className?: string;
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current || typeof SplitText.create !== "function") return;
      const split = SplitText.create(ref.current, {
        type: "words,chars",
        mask: "chars",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 120,
            filter: "blur(6px)",
            stagger: 0.02,
            duration: 0.9,
            ease: "power3.out",
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref }
  );

  if (as === "h2") {
    return (
      <h2 ref={ref} className={className}>
        {children}
      </h2>
    );
  }
  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
