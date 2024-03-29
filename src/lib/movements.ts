import type { IcalculateSineWave, IChaseMovement } from '../types';

/**
 * Makes the enemy spaceship move in a sine wave
 */
export function calculateSineWave({
  yPosition,
  xStart,
  viewportWidth,
}: IcalculateSineWave) {
  const amplitude = viewportWidth / 2; // Adjust this to change the height of the wave
  const frequency = 0.01; // Adjust this to change the frequency of the wave
  const phase = xStart; // Adjust this to change the starting phase of the wave

  const xPosition =
    Math.sin(yPosition * frequency + phase) * amplitude + viewportWidth / 2; // 400 is the horizontal center of the screen

  return xPosition;
}

/**
 * Chase movement - let the enemy spaceship chase the player spaceship
 */
export function chaseMovement({
  playerX,
  playerY,
  enemyX,
  enemyY,
  speed,
  delta,
  xMultiply = 4,
  yMultiply = 1,
  direction = 1,
}: IChaseMovement) {
  // Calculate the distance between the player and enemy spaceships
  const dx = playerX - enemyX;
  const dy = playerY - enemyY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate the velocity needed to move towards the player
  const vx = (dx / distance) * speed * xMultiply;
  const vy = (dy / distance) * speed * yMultiply;

  // Add sinus wave to the x position, each enemy has a random direction
  const sinToAdd = Math.sin(enemyY / 40) * 4 * direction;

  // Update the enemy's position based on the velocity
  enemyX += (vx + sinToAdd) * delta;
  enemyY += vy * delta;

  // Return the updated position of the enemy spaceship
  return {
    x: enemyX,
    y: enemyY,
  };
}
