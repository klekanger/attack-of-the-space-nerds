/**
 * Returns a random number between two values.
 * The returned value is no lower than (and may possibly equal) min, and is less than (and not equal) max.
 *
 * @param min Minimum value
 * @param max Maximum value
 * @returns Number
 */

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
