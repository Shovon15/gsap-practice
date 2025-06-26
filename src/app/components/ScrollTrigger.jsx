"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Scroll() {
  const main = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      main.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: main.current,
          start: "top 80%", // when top of box hits 80% of viewport
          end: "top 30%",
          toggleActions: "play none none reverse",
          markers: true, // shows start & end visually
        },
      },
    );
  }, []);

  // useGSAP(
  //   () => {
  //     const boxes = gsap.utils.toArray(".box");
  //     boxes.forEach((box) => {
  //       gsap.to(box, {
  //         x: 650,
  //         scrollTrigger: {
  //           trigger: box,
  //           start: "bottom bottom",
  //           end: "top 20%",
  //           scrub: true,
  //           markers: true,
  //         },
  //       });
  //     });
  //   },
  //   { scope: main },
  // );

  return (
    <div className="min-h-[200vh] bg-gray-100 p-20">
      <div
        className="h-[300px] bg-blue-500 text-white text-2xl flex items-center justify-center"
        ref={main}
      >
        I Animate on Scroll!
      </div>
    </div>
    // <div>
    //   <section className="section flex-center column">
    //     <h2>Basic ScrollTrigger with React</h2>
    //     <p>Scroll down to see the magic happen!!</p>
    //   </section>
    //   <div className="section flex-center column" ref={main}>
    //     <div className="box gradient-blue h-[100px] bg-blue-500 w-[100px]">
    //       box
    //     </div>
    //     <div className="box gradient-blue h-[100px] bg-blue-500 w-[100px]">
    //       box
    //     </div>
    //     <div className="box gradient-blue h-[100px] bg-blue-500 w-[100px]">
    //       box
    //     </div>
    //     <div className="border border-red-500 h-[700px]"></div>
    //   </div>
    //   <section className="section"></section>
    // </div>
  );
}
