"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TwoLineHeading from "../components/typography/TwoLineHeading";
import Paragraph from "../components/typography/Paragraph";

gsap.registerPlugin(ScrollTrigger);

type SectionData = {
  id: number;
  topText?: string;
  bottomText?: string;
  content?: string;
};

const sections: SectionData[] = [
  {
    id: 1,
    topText: "lorem ipsum dolor",
    bottomText: "sit amet",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptate.",
  },
  {
    id: 2,
    topText: "lorem ipsum dolor",
    bottomText: "sit amet",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptate.",
  },
  {
    id: 3,
    topText: "another heading",
    bottomText: "goes here",
    content:
      "This is the third section. You can keep different heading and paragraph data here.",
  },
  {
    id: 4,
    topText: "smooth scrolling",
    bottomText: "with gsap",
    content:
      "Using GSAP ScrollTrigger, each section content moves slightly for a parallax feel.",
  },
  {
    id: 5,
    topText: "final section",
    bottomText: "done nicely",
    content:
      "This is the last section. You can fully control the content from the data array.",
  },
];

const Page = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      contentRefs.current.forEach((content, index) => {
        const section = sectionRefs.current[index];

        if (!content || !section) return;

        gsap.fromTo(
          content,
          { y: 80 },
          {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="border-4 border-blue-500 h-screen overflow-hidden flex items-center"
        >
          <div
            ref={(el) => {
              contentRefs.current[index] = el;
            }}
            className="w-full px-4 md:px-8 lg:px-12"
          >
            {section.topText && section.bottomText && (
              <TwoLineHeading
                topText={section.topText}
                bottomText={section.bottomText}
                className="text-left text-[clamp(64px,_calc(4.9869vw+44.551px),_140.3px)]"
              />
            )}

            {section.content && (
              <Paragraph
                className="text-[clamp(14px,1.2vw,16px)] md:max-w-[76%] pt-[4vw] lg:pt-[2.2vw]"
                content={section.content}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
