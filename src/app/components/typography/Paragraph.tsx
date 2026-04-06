"use client";

import React, { useLayoutEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

type Props = {
  content?: string;
  className?: string;
};

const decodeHtmlEntities = (text: string) => {
  if (typeof window === "undefined") return text;
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
};

const Paragraph = ({ content = "", className }: Props) => {
  const pRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!pRef.current) return;

    const ctx = gsap.context(() => {
      SplitText.create(pRef.current, {
        type: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            y: 30,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: pRef.current,
              start: "top 90%",
              once: true,
              // markers: true,
            },
          });
        },
      });
    }, pRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <div
      ref={pRef}
      className={cn(
        "font-dmSans font-[300] text-white py-5 text-[clamp(14px,1.2vw,16px)] leading-[clamp(20px,1.6vw,26px)]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(content) }}
    />
  );
};

export default Paragraph;
