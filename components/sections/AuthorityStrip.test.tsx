import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthorityStrip } from "./AuthorityStrip";

describe("AuthorityStrip", () => {
  it("renders all 5 authority indicators", () => {
    render(<AuthorityStrip />);
    expect(screen.getByText("Arquitetura moderna")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvimento escalável")).toBeInTheDocument();
    expect(screen.getByText("Tecnologias atuais")).toBeInTheDocument();
    expect(screen.getByText("Processo estruturado")).toBeInTheDocument();
    expect(screen.getByText("Segurança e performance")).toBeInTheDocument();
  });
});
