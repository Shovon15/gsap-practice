"use client";

import React, { useState } from "react";
import CopyWrapper from "./CopyWrapper";
import CustomCalculator from "./CustomCalculator";

// type ClampResult = {
//   a: number; // vw coefficient
//   b: number; // px offset
//   tailwind: string; // Tailwind arbitrary value clamp()
// };

function makeClamp(
  w1, // viewport width 1 (px)
  f1, // font size 1 (px)
  w2, // viewport width 2 (px)
  f2, // font size 2 (px)
) {
  const vw1 = w1 / 100;
  const vw2 = w2 / 100;

  const a = (f2 - f1) / (vw2 - vw1); // coefficient for vw
  const b = f1 - a * vw1; // px offset

  const aRounded = Number(a.toFixed(4));
  const bRounded = Number(b.toFixed(4));

  const min = Math.min(f1, f2);
  const max = Math.max(f1, f2);

  const tailwind = `text-[clamp(${min}px,_calc(${aRounded}vw+${bRounded}px),_${max}px)]`;

  return { a: aRounded, b: bRounded, tailwind };
}

// type DeviceInput = {
//   width: string;
//   font: string;
// };

const Calculator = () => {
  const [devices, setDevices] = useState([
    { width: "430", font: "40.88" },
    { width: "1152", font: "57.31" }, // optional middle point
    { width: "1920", font: "80" },
  ]);

  const [classNameResult, setClassNameResult] = useState("");
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

    // Take only rows where both width & font are provided
    const validRows = devices
      .map((d) => ({
        width: parseFloat(d.width),
        font: parseFloat(d.font),
      }))
      .filter(
        (d) =>
          !Number.isNaN(d.width) &&
          !Number.isNaN(d.font) &&
          d.width > 0 &&
          d.font > 0,
      );

    if (validRows.length < 2) {
      setError("Please provide at least 2 devices (width + font).");
      return;
    }

    // Sort by width ascending and use smallest & largest as endpoints
    const sorted = [...validRows].sort((a, b) => a.width - b.width);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    if (first.width === last.width) {
      setError("Device widths must be different.");
      return;
    }

    const { tailwind } = makeClamp(
      first.width,
      first.font,
      last.width,
      last.font,
    );

    setClassNameResult(tailwind);
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold">Clamp ClassName Calculator</h1>

        <p className="text-sm text-gray-400">
          Fill at least <strong>2</strong> device widths and font sizes (e.g.
          375 → 40.88, 1920 → 80). The 3rd is optional.
        </p>

        <div className="space-y-3">
          {devices.map((device, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="w-14 text-sm text-gray-300">
                {index === 0
                  ? "Device 1"
                  : index === 1
                  ? "Device 2"
                  : "Device 3"}
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
                placeholder="Font (px)"
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

      <div className="pt-10">
        <h1 className="text-center text-4xl font-bold"> Custom Calculator</h1>
        <CustomCalculator />
      </div>
    </div>
  );
};

export default Calculator;
