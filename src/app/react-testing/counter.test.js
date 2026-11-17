// import { describe, expect, it } from "vitest";

// import { calculateCounterValue } from "./counter";

// describe("calculateCounterValue", () => {
//   it("adds a positive amount to the current value", () => {
//     const result = calculateCounterValue(2, 1);

//     expect(result).toBe(3);
//   });

//   it("subtracts an amount from the current value", () => {
//     const result = calculateCounterValue(3, -1);

//     expect(result).toBe(2);
//   });

//   it("does not return a value below zero", () => {
//     const result = calculateCounterValue(0, -1);

//     expect(result).toBe(0);
//   });

//   it.each([
//     [5, 2, 7],
//     [5, -2, 3],
//     [1, -10, 0],
//   ])(
//     "calculates %s + %s as %s",
//     (currentValue, amount, expectedValue) => {
//       expect(calculateCounterValue(currentValue, amount)).toBe(expectedValue);
//     },
//   );
// });

import { describe, expect, it } from "vitest";

import { calculateCounterValue, clampCounterValue } from "./counter";

describe("clampCounterValue", () => {
  it("returns the value when it is within the allowed range", () => {
    expect(clampCounterValue(5, 0, 10)).toBe(5);
  });

  it("returns the minimum when the value is too small", () => {
    expect(clampCounterValue(-5, 0, 10)).toBe(0);
  });

  it("returns the maximum when the value is too large", () => {
    expect(clampCounterValue(15, 0, 10)).toBe(10);
  });

  it("uses zero and ten as default limits", () => {
    expect(clampCounterValue(-1)).toBe(0);
    expect(clampCounterValue(20)).toBe(10);
  });

  it.each([
    [-5, 0, 10, 0],
    [5, 0, 10, 5],
    [15, 0, 10, 10],
    [50, 20, 40, 40],
    [10, 20, 40, 20],
  ])(
    "clamps %s between %s and %s as %s",
    (value, minimum, maximum, expectedValue) => {
      expect(clampCounterValue(value, minimum, maximum)).toBe(expectedValue);
    },
  );
});

describe("calculateCounterValue", () => {
  it("increments the current value", () => {
    expect(calculateCounterValue(2, 1)).toBe(3);
  });

  it("decrements the current value", () => {
    expect(calculateCounterValue(3, -1)).toBe(2);
  });

  it("does not return a negative value", () => {
    expect(calculateCounterValue(0, -1)).toBe(0);
  });

  it("does not exceed the default maximum value", () => {
    expect(calculateCounterValue(10, 1)).toBe(10);
  });

  it("supports a custom maximum value", () => {
    expect(calculateCounterValue(18, 5, 20)).toBe(20);
  });

  it.each([
    [5, 2, 10, 7],
    [5, -2, 10, 3],
    [1, -10, 10, 0],
    [9, 5, 10, 10],
    [10, 5, 20, 15],
    [18, 5, 20, 20],
  ])(
    "calculates current value %s with amount %s and maximum %s as %s",
    (currentValue, amount, maximumValue, expectedValue) => {
      expect(calculateCounterValue(currentValue, amount, maximumValue)).toBe(
        expectedValue,
      );
    },
  );
});
