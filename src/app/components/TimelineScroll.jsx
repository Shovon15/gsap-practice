"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineScroll() {
  const containerRef = useRef();

  const boxes = [
    { id: 1, label: "Box 1", color: "bg-red-500", x: -200 },
    { id: 2, label: "Box 2", color: "bg-blue-500", y: 200 },
    { id: 3, label: "Box 3", color: "bg-green-500", x: -200 },
    { id: 4, label: "Box 4", color: "bg-yellow-500", x: 200 },
    { id: 5, label: "Box 5", color: "bg-purple-500", y: -200 },
    { id: 6, label: "Box 6", color: "bg-pink-500", x: 200 },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 50%",
        end: "top 20%",
        scrub: true,
        markers: true,
      },
    });

    boxes.forEach((_, index) => {
      tl.from(
        `.box-${index}`,
        {
          x: boxes[index].x || 0,
          y: boxes[index].y || 0,
          opacity: 0,
          duration: 1,
        },
        "<0.1",
      );
    });
  }, []);

  //   useGSAP(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: containerRef.current,
  //         start: "top 80%",
  //         end: "top 20%",
  //         scrub: true,
  //         markers: true,
  //       },
  //     });

  //     tl.from(".box1", { x: -200, opacity: 0, duration: 1 })
  //       .from(".box2", { y: 200, opacity: 0, duration: 1 }, "<0.3")
  //       .from(".box3", { x: 400, opacity: 0, duration: 1 }, "<0.3")
  //       .from(".box4", { x: 600, opacity: 0, duration: 1 }, "<0.3")
  //       .from(".box5", { x: 800, opacity: 0, duration: 1 }, "<0.3")
  //       .from(".box6", { x: 1000, opacity: 0, duration: 1 }, "<0.3");
  //   }, []);

  return (
    <div ref={containerRef} className="min-h-[150vh] bg-white p-20 space-y-10">
      {boxes.map((box, index) => (
        <div
          key={box.id}
          className={`box-${index} w-40 h-40 ${box.color} text-white flex items-center justify-center text-xl`}
        >
          {box.label}
        </div>
      ))}
    </div>
    // <div ref={containerRef} className="min-h-[150vh] bg-white p-20 space-y-10">
    //   <div className="box1 w-40 h-40 bg-red-500 text-white flex items-center justify-center text-xl">
    //     Box 1
    //   </div>
    //   <div className="box2 w-40 h-40 bg-blue-500 text-white flex items-center justify-center text-xl">
    //     Box 2
    //   </div>
    //   <div className="box3 w-40 h-40 bg-green-500 text-white flex items-center justify-center text-xl">
    //     Box 3
    //   </div>
    // </div>
  );
}
