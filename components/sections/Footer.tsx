"use client";

import dynamic from "next/dynamic";
import { content } from "@/lib/content";
import { jadWordmarkFont } from "@/lib/fonts";

const DevLanyard = dynamic(() => import("./DevLanyard").then((m) => m.DevLanyard), {
  ssr: false,
});

export function Footer() {
  const { wordmark, wordmarkFull, tagline, stack, links } = content.footer;

  return (
    <footer className="relative overflow-hidden border-t border-line px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <DevLanyard />
        <div className="mt-10 flex flex-col items-start gap-2">
          <span className={`${jadWordmarkFont.className} text-2xl`}>{wordmark}</span>
          <p className="text-fg-muted">{tagline}</p>
          <p className="text-sm text-fg-subtle">{stack}</p>
        </div>
        <nav className="mt-10 flex gap-6 text-sm text-fg-muted">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-16 border-t border-line pt-6 text-xs text-fg-subtle">
          © 2026 JAD. Todos os direitos reservados.
        </div>
      </div>
      <div
        aria-hidden="true"
        className={`${jadWordmarkFont.className} pointer-events-none -mb-4 mt-10 select-none text-center leading-none text-foreground/5`}
        style={{ fontSize: "var(--text-watermark)" }}
      >
        {wordmarkFull}
      </div>
    </footer>
  );
}
