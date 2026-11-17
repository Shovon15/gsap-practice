import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AboutPage from "./page";

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    from: vi.fn(),
    registerPlugin: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("./VideoPlayer", () => ({
  VideoPlayer: () => <div data-testid="video-player" />,
}));

describe("AboutPage navigation", () => {
  it("links the Home button only to the root route", () => {
    render(<AboutPage />);

    const homeButton = screen.getByRole("button", { name: "Home" });
    const homeLink = homeButton.closest("a");

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).not.toHaveAttribute("href", "/about");
  });
});
