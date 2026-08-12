import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./AntigravityField", () => ({
  AntigravityField: () => <div data-testid="antigravity-field-stub" />,
}));

import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the badge, headline, subheadline and both CTAs", async () => {
    render(<Hero />);
    expect(screen.getByText("ENGENHARIA DIGITAL INTELIGENTE")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      "Construímos sistemas inteligentes para empresas que querem evoluir."
    );
    expect(screen.getByRole("link", { name: "Conhecer soluções" })).toHaveAttribute("href", "#solucoes");
    expect(screen.getByRole("link", { name: "Falar com especialista" })).toHaveAttribute("href", "#cta-final");
  });
});
