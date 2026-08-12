"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { jadWordmarkFont } from "@/lib/fonts";
import { StaggeredMenu } from "./StaggeredMenu";
import { SpringLink, SpringButton } from "@/components/motion/SpringPress";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 md:px-10">
          <a href="#home" className={`${jadWordmarkFont.className} text-xl text-foreground`}>
            JAD
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {content.nav.items.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-fg-muted transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <SpringLink
              href={content.nav.ctaHref}
              className="hidden rounded-pill bg-foreground px-6 py-2.5 text-sm font-medium text-background sm:inline-flex"
            >
              {content.nav.ctaLabel}
            </SpringLink>
            <SpringButton
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-pill border border-line px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-fg-muted transition-colors hover:text-foreground"
            >
              {open ? "Fechar" : "Menu"}
            </SpringButton>
          </div>
        </div>
      </header>
      <StaggeredMenu
        items={content.nav.items}
        ctaLabel={content.nav.ctaLabel}
        ctaHref={content.nav.ctaHref}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
