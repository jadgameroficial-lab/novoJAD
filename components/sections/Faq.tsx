import { content } from "@/lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function Faq() {
  const { headline, items } = content.faq;
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <h2 className="text-center text-3xl font-semibold sm:text-4xl">{headline}</h2>
      <FadeInStagger className="mt-12">
        <Accordion className="gap-2">
          {items.map((item, i) => (
            <FadeInItem key={item.question}>
              <AccordionItem
                value={`faq-${i}`}
                className="rounded-2xl border border-line bg-surface px-5"
              >
                <AccordionTrigger className="py-5 text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-fg-muted">{item.answer}</AccordionContent>
              </AccordionItem>
            </FadeInItem>
          ))}
        </Accordion>
      </FadeInStagger>
    </section>
  );
}
