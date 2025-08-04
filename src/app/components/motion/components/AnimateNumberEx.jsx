"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
// import { AnimateNumber } from "motion/react";

const AnimateNumberEx = () => {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  const handleChange = (newCount) => {
    setPrevCount(count);
    setCount(newCount);
  };

  const isIncrement = count > prevCount;

  return (
    <div className="p-10 text-4xl font-bold h-[100px] flex flex-col justify-center">
      <div className="relative h-[50px] overflow-hidden w-[100px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={count}
            initial={{
              y: isIncrement ? 40 : -40,
              opacity: 0,
              position: "absolute",
            }}
            animate={{ y: 0, opacity: 1, position: "absolute" }}
            exit={{
              y: isIncrement ? -40 : 40,
              opacity: 0,
              position: "absolute",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full text-center"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* <div>{count}</div> */}

      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => handleChange(count + 10)}
        >
          Increase
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => handleChange(count - 10)}
        >
          Decrease
        </button>
      </div>
    </div>
  );
};

export default AnimateNumberEx;
