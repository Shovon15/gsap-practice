"use client";

import React, { useRef, useState } from "react";
import "./style.css";

export default function Page() {
  const boxRef = useRef(null);
  const [pulses, setPulses] = useState([]);

  const handleClick = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = crypto.randomUUID();
    setPulses((prev) => [...prev, { id, x, y }]);

    // remove after animation duration (1s)
    setTimeout(() => {
      setPulses((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  return (
    <div
      ref={boxRef}
      onClick={handleClick}
      className="relative flex justify-center items-center h-full min-h-[100dvh] w-full overflow-hidden border-4"
    >
      <h2 className="font-bold text-[8vw] capitalize select-none">
        pulse effect page
      </h2>

      {pulses.map((p) => (
        <span key={p.id} className="pulse" style={{ left: p.x, top: p.y }} />
      ))}
    </div>
  );
}
