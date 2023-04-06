/**
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
