import { describe, expect, it } from "vitest";
import { content } from "./content";
import { assertNoEmDash } from "./content-rules";

function collectStrings(value: unknown, acc: string[] = []): string[] {
  if (typeof value === "string") acc.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, acc));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, acc));
  return acc;
}

describe("content", () => {
  it("contains no em dash anywhere", () => {
    for (const text of collectStrings(content)) {
      expect(() => assertNoEmDash(text)).not.toThrow();
    }
  });

  it("has the exact approved hero headline", () => {
    expect(content.hero.headline).toBe("Construímos sistemas inteligentes para empresas que querem evoluir.");
  });

  it("keeps the short headline alternative separate from the live headline", () => {
    expect(content.hero.headlineShortAlt).not.toBe(content.hero.headline);
    expect(content.hero.headlineShortAlt.split(" ").length).toBeLessThanOrEqual(6);
  });

  it("has 5 solutions, 5 process steps, 5 authority items and 4 differentiators", () => {
    expect(content.solutions.items).toHaveLength(5);
    expect(content.process.steps).toHaveLength(5);
    expect(content.authority.items).toHaveLength(5);
    expect(content.differentiators.items).toHaveLength(4);
  });

  it("has 6 real cases, each pointing at a webp image", () => {
    expect(content.cases.items).toHaveLength(6);
    content.cases.items.forEach((item) => {
      expect(item.image).toMatch(/\.webp$/);
    });
  });

  it("uses a bullet separator, not an em dash, in process step titles", () => {
    content.process.steps.forEach((step) => {
      expect(step.title).toContain("•");
      expect(step.title).not.toContain("—");
    });
  });
});
