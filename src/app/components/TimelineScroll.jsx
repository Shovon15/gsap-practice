"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineScroll() {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        markers: true,
      },
    });

    tl.from(".box1", { x: -200, opacity: 0, duration: 1 })
      .from(".box2", { y: 200, opacity: 0, duration: 1 }, "<0.3")
      .from(".box3", { x: 200, opacity: 0, duration: 1 }, "<0.3");
  }, []);

  return (
    <div ref={containerRef} className="min-h-[150vh] bg-white p-20 space-y-10">
      <div className="box1 w-40 h-40 bg-red-500 text-white flex items-center justify-center text-xl">Box 1</div>
      <div className="box2 w-40 h-40 bg-blue-500 text-white flex items-center justify-center text-xl">Box 2</div>
      <div className="box3 w-40 h-40 bg-green-500 text-white flex items-center justify-center text-xl">Box 3</div>
    </div>
  );
} 
