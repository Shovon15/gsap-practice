"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollSmoother);

const SmoothScroll = ({ children }) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Prevent double init
    if (ScrollSmoother.get()) return;

    ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2, // seconds it takes to "catch up"
      effects: true,
    });
  }, []);

  // useEffect(() => {
  //   ScrollSmoother.create({
  //     smooth: 1,
  //     effects: true,
  //   });
  // }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
