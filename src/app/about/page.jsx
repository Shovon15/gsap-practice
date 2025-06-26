"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const headingRef = useRef();

  useGSAP(() => {
    gsap.from(headingRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        // markers: true,
      },
    });
  }, []);

  return (
    <div className="min-h-screen p-20">
      <h1 ref={headingRef} className="text-5xl font-bold text-white">
        About Us Page
      </h1>

      <Link href="/">
        <button className="border rounded-md px-4 py-2 m-4 cursor-pointer">
          Home
        </button>
      </Link>
    </div>
  );
}
