"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  useGSAP(() => {
    gsap.to("#progress-bar", {
      width: "100%",
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
      },
    });
  }, []);

  return (
    <div
      id="progress-bar"
      className="fixed top-0 left-0 h-1 bg-green-500 w-0"
      style={{ zIndex: 100 }}
    ></div>
  );
};

export default ScrollProgress;
