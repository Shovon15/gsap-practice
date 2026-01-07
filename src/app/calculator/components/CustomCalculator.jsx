"use client";

import React, { useMemo, useState } from "react";
import CopyWrapper from "./CopyWrapper";

function makeClamp(w1, f1, w2, f2) {
  const vw1 = w1 / 100;
  const vw2 = w2 / 100;

  const a = (f2 - f1) / (vw2 - vw1); // coefficient for vw
  const b = f1 - a * vw1; // px offset

  const aRounded = Number(a.toFixed(4));
  const bRounded = Number(b.toFixed(4));

  const min = Math.min(f1, f2);
  const max = Math.max(f1, f2);

  // Tailwind arbitrary values: spaces become underscores
  const tailwind = `text-[clamp(${min}px,_calc(${aRounded}vw+${bRounded}px),_${max}px)]`;

  return { a: aRounded, b: bRounded, tailwind };
}

function predictFont(w1, f1, w2, f2, w3) {
  // linear interpolation/extrapolation
  const t = (w3 - w1) / (w2 - w1);
  return f1 + (f2 - f1) * t;
}

export default function CustomCalculator() {
  const [devices, setDevices] = useState([
    { width: "430", font: "40" },
    { width: "1152", font: "67" },
    { width: "1920", font: "" }, // leave empty to auto-predict
  ]);

  const [classNameResult, setClassNameResult] = useState("");
  const [predicted1920, setPredicted1920] = useState("");
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    setDevices((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCalculate = () => {
    setError("");
    setClassNameResult("");
    setPredicted1920("");

    const w1 = parseFloat(devices[0].width);
    const f1 = parseFloat(devices[0].font);

    const w2 = parseFloat(devices[1].width);
    const f2 = parseFloat(devices[1].font);

    const w3 = parseFloat(devices[2].width);

    if ([w1, f1, w2, f2].some((v) => Number.isNaN(v) || v <= 0)) {
      setError("Device 1 & 2 must have valid width and font (> 0).");
      return;
    }

    if (w1 === w2) {
      setError("Device 1 and Device 2 widths must be different.");
      return;
    }

    // If device 3 width is missing, just generate clamp between device 1 and 2
    const hasW3 = !Number.isNaN(w3) && w3 > 0;

    let endWidth = w2;
    let endFont = f2;

    if (hasW3) {
      // If device 3 font is missing or 0, predict it
      const f3Input = parseFloat(devices[2].font);
      const hasF3 = !Number.isNaN(f3Input) && f3Input > 0;

      const f3 = hasF3 ? f3Input : predictFont(w1, f1, w2, f2, w3);

      const roundedF3 = Number(f3.toFixed(2));
      setPredicted1920(String(roundedF3));

      // also write it back into the input for convenience (optional)
      if (!hasF3) {
        setDevices((prev) => {
          const copy = [...prev];
          copy[2] = { ...copy[2], font: String(roundedF3) };
          return copy;
        });
      }

      endWidth = w3;
      endFont = roundedF3;
    }

    // Use device 1 as start, device 3 (or device 2) as end.
    const { tailwind } = makeClamp(w1, f1, endWidth, endFont);
    setClassNameResult(tailwind);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Clamp ClassName Calculator</h1>

      <p className="text-sm text-gray-400">
        Enter Device 1 & 2 (width + font). Device 3 width (e.g. 1920) will be
        predicted if font is empty/0.
      </p>

      <div className="space-y-3">
        {devices.map((device, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="w-14 text-sm text-gray-300">
              {index === 0 ? "Device 1" : index === 1 ? "Device 2" : "Device 3"}
            </span>

            <input
              type="number"
              placeholder="Width (px)"
              className="flex-1 rounded border border-gray-600 bg-black/40 px-2 py-1 text-sm"
              value={device.width}
              onChange={(e) => handleChange(index, "width", e.target.value)}
            />

            <input
              type="number"
              step="0.01"
              placeholder={index === 2 ? "Font (auto)" : "Font (px)"}
              className="flex-1 rounded border border-gray-600 bg-black/40 px-2 py-1 text-sm"
              value={device.font}
              onChange={(e) => handleChange(index, "font", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCalculate}
        className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
      >
        Generate className
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {predicted1920 && (
        <p className="text-sm text-gray-200">
          Predicted font-size at {devices[2].width}px:{" "}
          <span className="font-semibold">{predicted1920}px</span>
        </p>
      )}

      {classNameResult && (
        <div className="mt-3">
          <p className="text-sm text-gray-300 mb-1">Tailwind className:</p>
          <CopyWrapper text={classNameResult}>
            <code className="block rounded bg-black/60 p-2 text-xl text-green-300 break-all">
              {classNameResult}
            </code>
          </CopyWrapper>
        </div>
      )}
    </div>
  );
}
