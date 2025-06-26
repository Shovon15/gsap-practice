"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText"; // Requires Club membership

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SplitTextReveal() {
  const textRef = useRef();

  useEffect(() => {
    const split = new SplitText(textRef.current, {
      type: "lines",
      linesClass: "split-line",
    });

    gsap.from(split.lines, {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.5,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: true,
      },
    });

    return () => {
      split.revert(); // cleanup
    };
  }, []);

  return (
    <div className="">
      <div className="h-[2100px]"></div>
      <div className="min-h-[150vh] p-20 text-2xl leading-relaxed">
        <div ref={textRef}>
          SplitText lets you animate lines of text as they enter the viewport.
          Each line is revealed with a staggered scroll animation using GSAP and
          ScrollTrigger.
        </div>
      </div>
    </div>
  );
}
