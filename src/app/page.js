import Image from "next/image";
import Basic from "./components/Basic";
import TickerBox from "./components/TickerBox";
import GsapFromToExample from "./components/GsapFromToExample";
import Scroll from "./components/ScrollTrigger";
import SlideInSection from "./components/SlideInSection";
import PinnedSection from "./components/PinnedSection";
import TimelineScroll from "./components/TimelineScroll";

export default function Home() {
  return (
    <div>
      <Basic />
      <TickerBox />
      <GsapFromToExample />
      {/* <div className="h-[1200px]"></div> */}

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
    </div>
  );
}
