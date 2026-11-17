"use client";

import { useState } from "react";
import { calculateCounterValue } from "./counter";

const Page = () => {
  const [value, setValue] = useState(0);

  const maximumValue = 10;

  const changeCounter = (amount) => {
    setValue((currentValue) =>
      calculateCounterValue(currentValue, amount, maximumValue),
    );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-4xl font-bold">{value}</h1>

      <p>
        Minimum: 0 | Maximum: {maximumValue}
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => changeCounter(-1)}
          disabled={value === 0}
          className="rounded bg-red-500 px-5 py-2 text-white disabled:opacity-50"
        >
          Decrement
        </button>

        <button
          type="button"
          onClick={() => changeCounter(1)}
          disabled={value === maximumValue}
          className="rounded bg-green-500 px-5 py-2 text-white disabled:opacity-50"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default Page;