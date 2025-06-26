"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const GsapFromToExample = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      {
        x: -200,     // Start 200px to the left
        opacity: 0,  // Start invisible
      },
      {
        x: 0,        // End at original position
        opacity: 1,  // Fade in
        duration: 1.5,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div
        ref={boxRef}
        className="w-32 h-32 bg-green-500 text-white flex items-center justify-center text-lg font-semibold rounded"
      >
        FromTo
      </div>
    </div>
  );
};

export default GsapFromToExample;
