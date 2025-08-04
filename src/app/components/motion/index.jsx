"use client";
import React from "react";
import AnimatePresenceEx from "./components/AnimatePresenceEx";
import AnimateNumberEx from "./components/AnimateNumberEx";

const MotionPage = () => {
  return (
    <div>
      <p className="text-center text-2xl">MotionPage</p>

      {/* <AnimatePresenceEx /> */}
      <AnimateNumberEx />
    </div>
  );
};

export default MotionPage;
