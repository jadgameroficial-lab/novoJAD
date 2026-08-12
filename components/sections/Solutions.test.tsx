import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Solutions } from "./Solutions";

describe("Solutions", () => {
  it("renders all 5 solution items", () => {
    render(<Solutions />);
    expect(screen.getByText("Sistemas Personalizados")).toBeInTheDocument();
    expect(screen.getByText("Plataformas SaaS")).toBeInTheDocument();
    expect(screen.getByText("Inteligência Artificial")).toBeInTheDocument();
    expect(screen.getByText("Automação Inteligente")).toBeInTheDocument();
    expect(screen.getByText("Experiências Digitais")).toBeInTheDocument();
  });
});
