import { content } from "@/lib/content";
import { DecryptedText } from "@/components/motion/DecryptedText";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function Differentiators() {
  const { headline, items } = content.differentiators;
  return (
    <section id="diferenciais" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <FadeInStagger className="mt-12 grid gap-10 sm:grid-cols-2">
        {items.map((item) => (
          <FadeInItem key={item.title} hover className="border-t border-line pt-6">
            <h3 className="text-xl font-medium">
              <DecryptedText text={item.title} />
            </h3>
            <p className="mt-2 text-fg-muted">{item.description}</p>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}
