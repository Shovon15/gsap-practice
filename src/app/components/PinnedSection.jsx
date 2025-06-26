"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PinnedSection() {
  const sectionRef = useRef();

  useGSAP(() => {
    gsap.to(sectionRef.current, {
      backgroundColor: "#4f46e5", // Indigo
      color: "#fff",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=600", // scroll 300px while pinned
        pin: true,
        scrub: true,
        markers: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-[100vh] bg-gray-200 text-black text-4xl font-bold flex items-center justify-center"
    >
      I am pinned and animated!
    </section>
  );
}
