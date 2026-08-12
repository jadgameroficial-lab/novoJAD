import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./DevLanyard", () => ({ DevLanyard: () => <div data-testid="dev-lanyard-stub" /> }));

import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the wordmark, tagline, stack line and the Just A Dream watermark", () => {
    render(<Footer />);
    expect(screen.getAllByText("JAD").length).toBeGreaterThan(0);
    expect(screen.getByText("Engenharia digital inteligente.")).toBeInTheDocument();
    expect(screen.getByText("Sistemas • IA • Automação")).toBeInTheDocument();
    expect(screen.getByText("Just A Dream")).toBeInTheDocument();
  });
});
