import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ScrollLine", () => ({ ScrollLine: () => <div data-testid="scroll-line-stub" /> }));

import { Process } from "./Process";

describe("Process", () => {
  it("renders all 5 steps in order", () => {
    render(<Process />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);
    expect(titles).toEqual(["01 • Descoberta", "02 • Estratégia", "03 • Design", "04 • Desenvolvimento", "05 • Evolução"]);
  });
});
