import Image from "next/image";
import Basic from "./components/Basic";
import TickerBox from "./components/TickerBox";
import GsapFromToExample from "./components/GsapFromToExample";
import Scroll from "./components/ScrollTrigger";
import SlideInSection from "./components/SlideInSection";
import PinnedSection from "./components/PinnedSection";
import TimelineScroll from "./components/TimelineScroll";
import StaggerList from "./components/StaggerList";
import SplitTextReveal from "./components/SplitText/SplitTextReveal";
import SplitTextWordsChars from "./components/SplitText/SplitTextWordsChars";
import ParallaxSection from "./components/parallax/ParallaxSection";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/about">
        <button className="border rounded-md px-4 py-2 m-4 cursor-pointer">
          about
        </button>
      </Link>
      {/* <Basic />
      <TickerBox />
      <GsapFromToExample />

      <Scroll />

      <div className="min-h-[200vh] bg-gray-100 p-20">
        <SlideInSection direction="left">
          <h2 className="text-2xl font-bold">Slide In from Left</h2>
        </SlideInSection>

        <SlideInSection direction="right">
          <h2 className="text-2xl font-bold">Slide In from Right</h2>
        </SlideInSection>

        <SlideInSection direction="top">
          <h2 className="text-2xl font-bold">Slide In from Top</h2>
        </SlideInSection>

        <SlideInSection direction="bottom">
          <h2 className="text-2xl font-bold">Slide In from Bottom</h2>
        </SlideInSection>
      </div>

      <div>
        <div className="h-[100vh] bg-pink-200 flex justify-center items-center">
          Scroll down to pin!
        </div>

        <PinnedSection />

        <div className="h-[100vh] bg-green-200 flex justify-center items-center">
          Done pinning!
        </div>
      </div>

      <TimelineScroll />
      <StaggerList /> */}

      {/* <SplitTextReveal />
      <SplitTextWordsChars /> */}
      <ParallaxSection />
      <div className="h-[2100px]"></div>
    </div>
  );
}
