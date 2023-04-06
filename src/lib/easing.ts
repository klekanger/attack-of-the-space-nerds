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

export function easeOutSine(t: number, b: number, c: number, d: number) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

export function easeInOutElastic(t: number, b: number, c: number, d: number) {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t == 0) return b;
  if ((t /= d / 2) == 2) return b + c;
  if (!p) p = d * (0.3 * 1.5);
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
  if (t < 1)
    return (
      -0.5 *
        (a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
      b
    );
  return (
    a *
      Math.pow(2, -10 * (t -= 1)) *
      Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
      0.5 +
    c +
    b
  );
}

/**
 * Calculates the x position of a sinus wave
 *
 * @param time
 * @param speed
 * @param shift
 * @returns
 */

export function calculateSinusXPosition(time: number, speed = 0.1, shift = 0) {
  const amplitude = 400; // half the width of the range
  const frequency = speed; // how many cycles per unit of time
  const phaseShift = shift; // horizontal shift of the sine wave
  const yOffset = 400; // vertical offset of the sine wave

  const xPosition =
    amplitude * Math.sin(2 * Math.PI * frequency * time + phaseShift) + yOffset;

  return xPosition;
}

/**
 *
 * @param yPosition
 * @param xStart
 * @param viewportWidth
 * @returns xPosition
 */

export function calculateSineWave(
  yPosition: number,
  xStart: number,
  viewportWidth: number
) {
  const amplitude = viewportWidth / 2; // adjust this to change the height of the wave
  const frequency = 0.01; // adjust this to change the frequency of the wave
  const phase = xStart; // adjust this to change the starting phase of the wave

  const xPosition =
    Math.sin(yPosition * frequency + phase) * amplitude + viewportWidth / 2; // 400 is the horizontal center of the screen

  return xPosition;
}
