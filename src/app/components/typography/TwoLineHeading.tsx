"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";
import { cn } from "@/utils/cn";

gsap.registerPlugin(SplitText, ScrollTrigger);

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type TwoLineHeadingProps = {
  topText: string;
  bottomText: string;
  tag?: HeadingTag;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
} & React.HTMLAttributes<HTMLElement>;

export default function TwoLineHeading({
  topText,
  bottomText,
  tag = "h1",
  className,
  topClassName,
  bottomClassName,
  ...props
}: TwoLineHeadingProps) {
  const Comp = tag;
  const rootRef = useRef<HTMLHeadingElement | HTMLParagraphElement | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const topEl = rootRef.current?.querySelector('[data-split="top"]');
      const bottomEl = rootRef.current?.querySelector('[data-split="bottom"]');
      if (!topEl || !bottomEl) return;

      // Kill any existing ScrollTriggers for this element to avoid conflicts
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === rootRef.current) st.kill();
      });

      const topSplit = new SplitText(topEl, {
        type: "chars,words,lines",
        linesClass: "split-line",
      });

      const bottomSplit = new SplitText(bottomEl, {
        type: "chars,words,lines",
        linesClass: "split-line",
      });

      // start hidden
      gsap.set([...topSplit.chars, ...bottomSplit.chars], {
        y: 100,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.to(topSplit.chars, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 0.7,
      }).to(
        bottomSplit.chars,
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.04,
          duration: 0.7,
        },
        "-=0.35",
      );
    }, rootRef);

    // Force a refresh after a short delay to account for layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [topText, bottomText]);

  return (
    <Comp
      ref={rootRef}
      className={cn(
        "uppercase font-boldCond tracking-normal",
        "text-[clamp(3rem,8.92vw,12.42rem)]",
        className,
      )}
      {...props}
    >
      <span
        data-split="top"
        className={cn("text-primary block leading-none", topClassName)}
      >
        {topText}
      </span>
      <span
        data-split="bottom"
        className={cn("text-white block leading-none", bottomClassName)}
      >
        {bottomText}
      </span>
    </Comp>
  );
}
