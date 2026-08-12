import Image from "next/image";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export interface StickyCase {
  title: string;
  category: string;
  image: string;
}

// Renamed conceptually from the old pin-and-hide stack: every case is always visible in normal
// document flow (a real grid), never dependent on a scroll-driven animation to become visible.
// GSAP/Motion only add polish (fade-in stagger) here, never gate visibility.
export function StickyCardStack({ cards }: { cards: StickyCase[] }) {
  return (
    <FadeInStagger className="grid gap-6 sm:grid-cols-2">
      {cards.map((card) => (
        <FadeInItem
          key={card.title}
          className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={card.image}
              alt={`Screenshot do site ${card.title}`}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-6 sm:p-7">
            <p className="text-xs uppercase tracking-wide text-fg-subtle">{card.category}</p>
            <h3 className="mt-2 text-xl font-medium">{card.title}</h3>
          </div>
        </FadeInItem>
      ))}
    </FadeInStagger>
  );
}
