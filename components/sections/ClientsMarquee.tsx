import { content } from "@/lib/content";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function ClientsMarquee() {
  const { headline, subheadline, names } = content.clients;
  return (
    <section id="clientes" className="mx-auto max-w-5xl px-6 py-24 text-center md:px-10">
      <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <p className="mx-auto mt-4 max-w-xl text-fg-muted">{subheadline}</p>
      <FadeInStagger className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-fg-subtle">
        {names.map((name) => (
          <FadeInItem key={name} className="text-sm uppercase tracking-wide">
            {name}
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}
