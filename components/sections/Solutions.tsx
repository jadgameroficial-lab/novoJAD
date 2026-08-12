import { content } from "@/lib/content";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function Solutions() {
  const { headline, subheadline, items } = content.solutions;
  return (
    <section id="solucoes" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <p className="mt-4 max-w-xl text-fg-muted">{subheadline}</p>
      <FadeInStagger className="mt-12 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <FadeInItem
            key={item.title}
            hover
            className="rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-line-strong"
          >
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}
