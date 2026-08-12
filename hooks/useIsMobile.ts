"use client";

import { useEffect, useState } from "react";

function getInitial(breakpoint: number): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
}

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => getInitial(breakpoint));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
