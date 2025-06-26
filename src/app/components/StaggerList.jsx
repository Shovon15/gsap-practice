"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StaggerList() {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(".stagger-item", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 50%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        markers: true,
      },
    });
  }, []);

  return (
    <div ref={containerRef} className="min-h-[150vh] bg-gray-100 p-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="stagger-item h-40 bg-blue-500 text-white text-xl flex items-center justify-center rounded"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
