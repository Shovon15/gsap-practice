"use client";

// import { useGsapSmoothScroll } from "@/hooks/useGsapSmoothScroll";

// import { useGsapSmoothScroll } from "@/hooks/useGsapSmoothScroll.js";

// import SmoothScroll from "./components/SmoothScroll";

const RootProviders = ({ children }) => {
  // const { wrapperRef, contentRef } = useGsapSmoothScroll();
  return (
    <>
      {/* <div ref={wrapperRef} id="smooth-wrapper" className="smooth-wrapper">
        <div ref={contentRef} id="smooth-content" className="smooth-content">
          {children}
        </div>
      </div> */}
      {/* <SmoothScroll>{children}</SmoothScroll> */}
      {children}
    </>
  );
};

export default RootProviders;
