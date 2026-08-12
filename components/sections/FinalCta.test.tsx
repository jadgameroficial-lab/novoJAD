import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/hero/AntigravityField", () => ({
  AntigravityField: () => <div data-testid="antigravity-field-stub" />,
}));

import { FinalCta } from "./FinalCta";

describe("FinalCta", () => {
  it("renders the headline, subheadline and CTA link", async () => {
    render(<FinalCta />);
    expect(await screen.findByRole("heading")).toHaveTextContent("Pronto para construir o futuro da sua empresa?");
    expect(screen.getByText("Transforme suas ideias em sistemas inteligentes.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Iniciar projeto/ })).toHaveAttribute("href", "#cta-final");
  });
});
