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
 * @param {number} num Number to make positive or negative
 * @returns {number} A negative or positive version of `num`
 */
export function makeRandomPositiveOrNegative(num: number): number {
  return num * (Math.round(Math.random()) * 2 - 1);
}

/**
 * Check if user is on a mobile device
 *
 * @returns {boolean} true if user is on a mobile device
 *
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Hides all elements in a  NodeList of HTMLElements
 *
 * @param element A NodeList of HTMLElements
 */
export function hideAllElements(element: NodeListOf<HTMLElement>) {
  element.forEach((e) => {
    e.style.display = "none";
  });
}

/**
 * Shows all elements in a NodeList of HTMLElements
 *
 * @param element A NodeList of HTMLElements
 */
export function showAllElements(element: NodeListOf<HTMLElement>) {
  element.forEach((e) => {
    e.style.display = "block";
  });
}

/**
 * Checks in localStorage if audio is on or off
 *
 * @returns {boolean} true if audio is on
 */
export function isAudioEnabled(): boolean {
  const audio = localStorage.getItem("space_nerds_audio");
  return audio === "on" ? true : false;
}
