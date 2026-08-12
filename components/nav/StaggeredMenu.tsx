"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./StaggeredMenu.module.css";

export interface StaggeredMenuItem {
  label: string;
  href: string;
}

export function StaggeredMenu({
  items,
  ctaLabel,
  ctaHref,
  open,
  onClose,
}: {
  items: StaggeredMenuItem[];
  ctaLabel: string;
  ctaHref: string;
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    gsap.set(panelRef.current, { xPercent: 100, opacity: 1 });
  }, []);

  const playOpen = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel) return;
    openTlRef.current?.kill();
    const itemEls = panel.querySelectorAll(`.${styles.itemLabel}`);
    gsap.set(itemEls, { yPercent: 120 });

    const tl = gsap.timeline();
    if (backdrop) tl.to(backdrop, { opacity: 1, duration: 0.4 }, 0);
    tl.to(panel, { xPercent: 0, duration: 0.6, ease: "power4.out" }, 0);
    tl.to(itemEls, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.08 }, "-=0.35");
    openTlRef.current = tl;
  }, []);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel) return;
    openTlRef.current?.kill();
    gsap.to(panel, { xPercent: 100, duration: 0.4, ease: "power3.in" });
    if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.3 });
  }, []);

  useLayoutEffect(() => {
    if (open) playOpen();
    else playClose();
  }, [open, playOpen, playClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <div className={styles.wrapper}>
      <div ref={backdropRef} className={styles.backdrop} onClick={onClose} />
      <aside ref={panelRef} className={styles.panel} aria-hidden={!open}>
        <nav>
          <ul>
            {items.map((it) => (
              <li key={it.href} className={styles.itemWrap}>
                <a href={it.href} className={styles.item} onClick={onClose}>
                  <span className={styles.itemLabel}>{it.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={ctaHref} className={`${styles.item} mt-auto text-lg`} onClick={onClose}>
          {ctaLabel}
        </a>
      </aside>
    </div>
  );
}
