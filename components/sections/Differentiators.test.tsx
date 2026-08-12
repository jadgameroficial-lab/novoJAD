import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Differentiators } from "./Differentiators";

describe("Differentiators", () => {
  it("renders the headline and exposes all 4 item titles to assistive tech", () => {
    render(<Differentiators />);
    expect(screen.getByText("Mais do que desenvolvimento. Engenharia.")).toBeInTheDocument();
    expect(screen.getByText("Visão de produto")).toBeInTheDocument();
    expect(screen.getByText("Arquitetura escalável")).toBeInTheDocument();
    expect(screen.getByText("Inteligência aplicada")).toBeInTheDocument();
    expect(screen.getByText("Experiência premium")).toBeInTheDocument();
  });
});
