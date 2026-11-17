// export const calculateCounterValue = (currentValue, amount) => {
//   return Math.max(0, currentValue + amount);
// };


export const clampCounterValue = (value, minimum = 0, maximum = 10) => {
  return Math.min(maximum, Math.max(minimum, value));
};

export const calculateCounterValue = (
  currentValue,
  amount,
  maximumValue = 10,
) => {
  const newValue = currentValue + amount;

  return clampCounterValue(newValue, 0, maximumValue);
};