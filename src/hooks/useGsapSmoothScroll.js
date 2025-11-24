"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Make sure ScrollSmoother is installed/available
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function useGsapSmoothScroll() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current || !contentRef.current) return;

    // Kill existing smoother (hot reload, route changes, etc.)
    const existing = ScrollSmoother.get();
    if (existing) existing.kill();

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2, // higher = smoother/slower
      effects: true, // enables data-speed / data-lag effects
      normalizeScroll: true,
    });

    return () => {
      smoother?.kill();
      // optional: clean up ScrollTriggers too
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return { wrapperRef, contentRef };
}
