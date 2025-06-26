"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SlideInSection({ direction = "left", children }) {
  const el = useRef(null);

  useGSAP(() => {
    const x = direction === "left" ? -100 : direction === "right" ? 100 : 0;
    const y = direction === "top" ? -100 : direction === "bottom" ? 100 : 0;

    gsap.from(el.current, {
      x,
      y,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: true,
      },
    });
  }, []);

  return (
    <div ref={el} className="p-8 bg-red-500 shadow-lg rounded mb-12">
      {children}
    </div>
  );
}
