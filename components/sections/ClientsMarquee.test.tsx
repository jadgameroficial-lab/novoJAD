import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClientsMarquee } from "./ClientsMarquee";

describe("ClientsMarquee", () => {
  it("renders the headline and every placeholder name", () => {
    render(<ClientsMarquee />);
    expect(screen.getByText("Empresas que buscam o próximo nível.")).toBeInTheDocument();
    expect(screen.getByText("Norte Sistemas")).toBeInTheDocument();
  });
});
