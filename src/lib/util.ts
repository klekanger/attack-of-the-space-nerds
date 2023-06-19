/**
 * Returns a random number between two values.
 * The returned value is no lower than (and may possibly equal) min, and is less than (and not equal) max.
 *
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} return value
 *
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Makes a number random positive or negative
 *
 * @param {number} number_ Number to make positive or negative
 * @returns {number} A negative or positive version of `num`
 */
export function makeRandomPositiveOrNegative(number_: number): number {
  return number_ * (Math.round(Math.random()) * 2 - 1);
}

/**
 * Check if user is on a mobile device
 *
 * @returns {boolean} true if user is on a mobile device
 *
 */
export function isMobile(): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );
}
