import { content } from "@/lib/content";
import { StickyCardStack } from "./StickyCardStack";

export function Cases() {
  const { headline, subheadline, items } = content.cases;
  return (
    <section id="cases" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <h2 className="text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <p className="mt-4 max-w-xl text-fg-muted">{subheadline}</p>
      <div className="mt-12">
        <StickyCardStack cards={items} />
      </div>
    </section>
  );
}
