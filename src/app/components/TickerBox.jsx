"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const TickerBox = () => {
  const boxRef = useRef(null);
  let x = 0;
  const speed = 2;

  useEffect(() => {
    const box = boxRef.current;

    if (!box) return;

    const boxWidth = box.offsetWidth;
    const maxX = window.innerWidth - boxWidth; // stop at (100vw - box width)

    const update = () => {
      x += speed;

      if (x >= maxX) {
        x = maxX;
        gsap.ticker.remove(update);
      }

      box.style.transform = `translateX(${x}px)`;
    };

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update); // cleanup
  }, []);
  return (
    <div ref={boxRef} className="w-20 h-20 bg-green-500">
      Moving Box
    </div>
  );
};

export default TickerBox;
