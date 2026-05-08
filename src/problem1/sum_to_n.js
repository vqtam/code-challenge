/**
 * Problem 1: Three ways to sum to n
 *
 * Input: n - any integer
 * Output: sum from 1 to n
 *
 * Example:
 * sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 */

// Approach: Mathematical formula
// Time complexity: O(1)
// Space complexity: O(1)
export const sum_to_n_a = (n) => {
  const absN = Math.abs(n);

  const total =
    absN % 2 === 0 ? (absN / 2) * (absN + 1) : absN * ((absN + 1) / 2);

  return n < 0 ? -total : total;
};

// Approach: Countdown loop
// Time complexity: O(abs(n))
// Space complexity: O(1)
export const sum_to_n_b = (n) => {
  let total = 0;
  let current = n;

  while (current !== 0) {
    total += current;
    current += current > 0 ? -1 : 1;
  }

  return total;
};

// Approach: Two-pointer pairing
// Time complexity: O(abs(n))
// Space complexity: O(1)
export const sum_to_n_c = (n) => {
  const sign = n < 0 ? -1 : 1;
  const absN = Math.abs(n);

  let total = 0;
  let left = 1;
  let right = absN;

  while (left < right) {
    total += left + right;
    left++;
    right--;
  }

  if (left === right) {
    total += left;
  }

  return sign * total;
};
