import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoPlayer } from "./VideoPlayer";

describe("VideoPlayer source type", () => {
  it.each([
    ["movie.mp4", "video/mp4"],
    ["movie.webm", "video/webm"],
    ["movie.ogg", "video/ogg"],
    ["movie.ogv", "video/ogg"],
    ["movie.mov", "video/quicktime"],
    ["MOVIE.WEBM?token=abc#preview", "video/webm"],
  ])("uses the correct MIME type for %s", (src, expectedType) => {
    const { container } = render(<VideoPlayer src={src} title="Test video" />);

    const source = container.querySelector("source");

    expect(screen.getByLabelText("Test video")).toContainElement(source);
    expect(source).toHaveAttribute("src", src);
    expect(source).toHaveAttribute("type", expectedType);
  });

  it.each([
    "movie.avi",
    "https://www.w3schools.com/html/mov_bbb.ppp",
    "movie",
    "",
    undefined,
  ])("does not render an unsupported source (%s)", (src) => {
    const { container } = render(<VideoPlayer src={src} title="Test video" />);

    expect(container.querySelector("source")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unsupported video type.",
    );
  });

  it("shows an error when a supported type fails to load", () => {
    render(<VideoPlayer src="broken.mp4" title="Test video" />);

    fireEvent.error(screen.getByLabelText("Test video"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this video.",
    );
  });
});
