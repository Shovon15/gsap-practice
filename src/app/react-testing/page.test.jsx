import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("React testing counter", () => {
  it("starts at zero with decrement disabled", () => {
    render(<Page />);

    expect(screen.getByRole("heading", { name: "0" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrement" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increment" })).toBeEnabled();
  });

  it("increments the counter", () => {
    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("heading", { name: "1" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrement" }),
    ).toBeEnabled();
  });

  it("decrements the counter without going below zero", () => {
    render(<Page />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);

    expect(screen.getByRole("heading", { name: "0" })).toBeInTheDocument();
    expect(decrementButton).toBeDisabled();
  });
});
