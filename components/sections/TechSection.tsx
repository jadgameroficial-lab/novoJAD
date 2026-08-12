"use client";

import dynamic from "next/dynamic";
import { content } from "@/lib/content";

const TechCloud = dynamic(() => import("./TechCloud").then((m) => m.TechCloud), {
  ssr: false,
  loading: () => <div className="h-64" />,
});

const STACK_SLUGS = ["nextdotjs", "react", "typescript", "tailwindcss", "greensock", "threedotjs", "vercel"];

export function TechSection() {
  const { headline, subheadline } = content.tech;
  return (
    <section id="tecnologia" className="mx-auto max-w-5xl px-6 py-24 text-center md:px-10">
      <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <p className="mx-auto mt-4 max-w-xl text-fg-muted">{subheadline}</p>
      <div className="mt-4">
        <TechCloud slugs={STACK_SLUGS} />
      </div>
    </section>
  );
}
