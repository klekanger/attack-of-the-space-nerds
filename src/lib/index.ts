/**
 * Easing functions from Spicy Yoghurt (https://spicyyoghurt.com/tools/easing-functions)
 *
 * @param t Time - Amount of time that has passed since the beginning of the animation. Usually starts at 0 and is slowly increased using a game loop or other update function.
 * @param b Beginning value - The starting point of the animation. Usually it's a static value, you can start at 0 for example.
 * @param c Change in value - The amount of change needed to go from starting point to end point. It's also usually a static value.
 * @param d Duration - Amount of time the animation will take. Usually a static value aswell.
 * @returns number
 */

export function easeInOutSine(t: number, b: number, c: number, d: number) {
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
}
