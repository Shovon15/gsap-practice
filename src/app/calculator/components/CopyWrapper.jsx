"use client";

import React, { useState } from "react";

// interface CopyWrapperProps {
//   text: string;          // what to copy
//   children: React.ReactNode; // wrapped content
// }

export default function CopyWrapper({ text, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="relative inline-block cursor-pointer group"
    >
      {/* The wrapped content */}
      {children}

      {/* Copy icon in corner */}
      <div className="absolute -top-10 right-10 bg-black/60 p-1 rounded  transition border-2">
        📋
      </div>

      {/* Copied feedback */}
      {copied && (
        <div className="absolute -top-8 right-0 text-xs px-2 py-1 rounded bg-green-500 text-white">
          Copied!
        </div>
      )}
    </div>
  );
}
