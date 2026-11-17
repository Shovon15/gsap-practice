"use client";

import { useState } from "react";
import {
  ArrowDown,
  Check,
  Clipboard,
  ClipboardList,
  RefreshCcw,
  Search,
} from "lucide-react";
import styles from "./page.module.css";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "VAT Registration", icon: ClipboardList },
  { id: 2, title: "VAT Return", icon: Clipboard },
  { id: 3, title: "VAT Audit", icon: Search },
  { id: 4, title: "VAT Refund", icon: RefreshCcw },
];

export default function VatPage() {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const allDone = completedSteps === steps.length;

  const completeStep = (index) => {
    if (index === completedSteps) {
      setCompletedSteps((completed) => completed + 1);
    }
  };

  const resetSteps = () => setCompletedSteps(0);

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden flex items-center justify-center">
      
      {/* পর্দার পেছনের মূল কন্টেন্ট (যা পর্দা সরলে দেখা যাবে) */}
      <div className="text-center p-6 z-0 max-w-xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={isOpen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-amber-400 mb-4"
        >
          স্বাগতম Next.js প্রোজেক্টে!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isOpen ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 mb-8"
        >
          আপনার ওয়েবসাইটের মূল ড্যাশবোর্ড বা কন্টেন্ট এখন দৃশ্যমান।
        </motion.p>

        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg shadow-lg transition duration-300 cursor-pointer"
          >
            পর্দা আবার টানুন
          </button>
        )}
      </div>

      {/* কার্টেন র্যাপার */}
      <div 
        onClick={() => !isOpen && setIsOpen(true)}
        className={`absolute inset-0 flex z-50 select-none ${isOpen ? "pointer-events-none" : "cursor-pointer group"}`}
      >
        {/* বাম পাশের লাল পর্দা */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: isOpen ? 0 : 1 }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="w-1/2 h-full bg-gradient-to-r from-red-800 via-red-600 to-red-700 shadow-[inset_-20px_0_30px_rgba(0,0,0,0.5)] relative origin-left"
        >
          {/* পর্দার ভাঁজ (Folds Effect) */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,rgba(0,0,0,0.2)_50%,transparent_55%)] bg-[length:40px_100%] opacity-40"></div>
        </motion.div>

        {/* ডান পাশের লাল পর্দা */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: isOpen ? 0 : 1 }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="w-1/2 h-full bg-gradient-to-l from-red-800 via-red-600 to-red-700 shadow-[inset_20px_0_30px_rgba(0,0,0,0.5)] relative origin-right"
        >
          {/* পর্দার ভাঁজ (Folds Effect) */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,rgba(0,0,0,0.2)_50%,transparent_55%)] bg-[length:40px_100%] opacity-40"></div>
        </motion.div>

        {/* মাঝখানের ক্লিক নির্দেশনা টেক্সট */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-red-500 text-sm md:text-base font-semibold text-red-200 animate-pulse group-hover:scale-105 transition-transform duration-300"
            >
              পর্দা সরাতে যেকোনো জায়গায় ক্লিক করুন
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
  return (
    <div className="min-h-screen w-full">
      <svg viewBox="0 0 100 220" className="h-[220px] w-[100px] border">
        <circle cx="25" cy="75" r="20" fill="#1673B7" />
        <polygon
          points="50,160 55,180 70,180 60,190 65,205 50,195 35,205 40,190 30,180 45,180"
          fill="#00B686"
        />
      </svg>
      <div className="min-h-screen w-full">
        <div className="h-20 border-2" />
        <svg viewBox="0 0 100 100" className="h-40 w-40">
          <defs>
            <linearGradient
              id="circleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00B686" />
              <stop offset="50%" stopColor="#33CCFF" />
              <stop offset="100%" stopColor="#1673B7" />
            </linearGradient>
          </defs>
          {/* <defs>
            <linearGradient
              id="circleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#33ccff" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
          </defs> */}

          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="10"
          />
        </svg>
        <svg viewBox="0 0 100 220" className="h-[220px] w-[100px] border">
          {/* Circle */}
          <circle cx="50" cy="50" r="30" stroke="#33ccff" stroke-width="10" />

          {/* Polygon */}
          <polygon
            points="
          50,120
          55,140
          70,140
          60,150
          65,165
          50,155
          35,165
          40,150
          30,140
          45,140
        "
            fill="#00B686"
          />
        </svg>
      </div>
    </div>
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-transparent px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#003C5A]">VAT Process</h1>
        <p className="mt-2 text-sm text-slate-500">
          Complete each step to continue to the next stage.
        </p>
      </div>

      <section
        className="grid w-full max-w-5xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="VAT process steps"
      >
        {steps.map((step, index) => {
          const isDone = index < completedSteps;
          const isNext = index === completedSteps;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative">
              {isNext && !allDone && (
                <div className={styles.nextArrow} aria-hidden="true">
                  <span>Next step</span>
                  <ArrowDown size={22} strokeWidth={2.4} />
                </div>
              )}

              <button
                type="button"
                onClick={() => completeStep(index)}
                disabled={!isNext}
                aria-label={`${step.title}${isDone ? ", completed" : ""}`}
                className={`${styles.stepCard} ${isDone ? styles.completed : ""} ${
                  isNext ? styles.current : ""
                }`}
              >
                <span className={styles.stepNumber}>
                  {isDone ? (
                    <Check size={19} strokeWidth={3} />
                  ) : (
                    String(step.id).padStart(2, "0")
                  )}
                </span>

                <span className={styles.iconCircle}>
                  {isDone ? (
                    <Check
                      className={styles.completedTick}
                      size={40}
                      strokeWidth={3}
                    />
                  ) : (
                    <Icon size={35} strokeWidth={2} />
                  )}
                </span>

                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepStatus}>
                  {isDone
                    ? "Completed"
                    : isNext
                      ? "Click to complete"
                      : "Waiting"}
                </span>
              </button>
            </div>
          );
        })}
      </section>

      {allDone && (
        <div className="flex flex-col items-center gap-4" aria-live="polite">
          <p className="font-semibold text-emerald-600">
            All four stages are complete!
          </p>
          <button
            type="button"
            onClick={resetSteps}
            className="cursor-pointer rounded-lg border border-emerald-600 px-5 py-2.5 font-semibold text-emerald-700 transition hover:bg-emerald-50 active:scale-95"
          >
            Start Again
          </button>
        </div>
      )}
    </main>
  );
}
