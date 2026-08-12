import { content } from "@/lib/content";
import { ScrollLine } from "./ScrollLine";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function Process() {
  const { headline, steps } = content.process;
  return (
    <section id="processo" className="mx-auto grid max-w-5xl gap-12 px-6 py-24 sm:grid-cols-[80px_1fr] md:px-10">
      <ScrollLine className="hidden text-fg-subtle sm:block" />
      <div>
        <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
        <FadeInStagger className="mt-12 space-y-10">
          {steps.map((step) => (
            <FadeInItem key={step.title}>
              <h3 className="text-xl font-medium">{step.title}</h3>
              <p className="mt-2 max-w-lg text-fg-muted">{step.description}</p>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
