"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function SplitTextWordsChars() {
  const textRef = useRef();

  useEffect(() => {
    // Split text into words and characters inside words
    const split = new SplitText(textRef.current, {
      type: "words,chars",
      wordsClass: "split-word",
      charsClass: "split-char",
    });

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power3.out",
      stagger: 0.05,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 50%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        markers: true,
      },
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div className="min-h-[150vh] p-20 text-2xl leading-relaxed" ref={textRef}>
      Animate each word and each letter with staggered smooth motion on scroll
      using GSAP and SplitText!
    </div>
  );
}
