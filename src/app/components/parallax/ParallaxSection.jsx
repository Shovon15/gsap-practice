"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection() {
  const containerRef = useRef();
  const bgRef = useRef();
  const fgRef = useRef();

  useGSAP(() => {
    // Animate background slower downward
    gsap.to(bgRef.current, {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true, // Uncomment to debug scroll points
      },
    });

    // Animate foreground faster upward
    gsap.to(fgRef.current, {
      y: -250,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true,
      },
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] overflow-hidden" // Enough scroll height
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-700 flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <h1 className="text-white text-5xl font-bold">Background Layer</h1>
      </div>
      <div
        ref={fgRef}
        className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold text-yellow-300"
        style={{ zIndex: 10, pointerEvents: "none" }}
      >
        Foreground Layer
      </div>
    </section>
  );
}
