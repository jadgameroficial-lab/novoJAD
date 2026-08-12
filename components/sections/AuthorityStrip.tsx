import { content } from "@/lib/content";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeInStagger";

export function AuthorityStrip() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-2 md:px-10">
      <FadeInStagger className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        {content.authority.items.map((item, i) => (
          <FadeInItem key={item} className="flex items-center gap-3">
            <span className="text-xs text-fg-subtle">{item}</span>
            {i < content.authority.items.length - 1 && (
              <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-fg-subtle opacity-50" />
            )}
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  );
}
