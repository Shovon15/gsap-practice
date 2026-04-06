const value = [1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 13];

value.sort((a, b) => a - b);
let max = 1;
let current = 1;

for (let i = 0; i < value.length - 1; i++) {
  if (value[i] + 1 == value[i + 1]) {
    current++;
  } else {
    max = Math.max(max, current);
    current = 1;
  }
}
max = Math.max(max, current);

console.log(max, current, "max");
