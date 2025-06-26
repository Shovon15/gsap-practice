"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Basic = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { y: 500, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "elastic.out(2, 0.3)" },
    );
  }, []);

  return (
    <div
      ref={boxRef}
      className="w-40 h-40 bg-blue-500 text-white flex items-center justify-center text-xl rounded"
    >
      Hello
    </div>
  );
};

export default Basic;
