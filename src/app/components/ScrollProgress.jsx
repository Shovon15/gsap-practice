"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  useEffect(() => {
    gsap.to("#progress-bar", {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
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
