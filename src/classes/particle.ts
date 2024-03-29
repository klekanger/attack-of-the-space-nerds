import { randomBetween } from '../lib/util';
import type { IGame, IParticle } from '../types';

export class Particle implements IParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
  markedForDeletion: boolean;
  color: string;
  colorPalette: Array<{ r: number; g: number; b: number }>;
  currentAlpha: number;

  constructor(private readonly game: IGame, x: number, y: number) {
    this.x = x || Math.round(Math.random() * game.width);
    this.y = y || Math.round(Math.random() * game.height);
    this.radius = Math.ceil(Math.random() * 10);
    this.speed = (Math.ceil(Math.random() * 40) + 10) ** 0.7 * 0.5;
    this.direction = Math.round(Math.random() * 360);
    this.markedForDeletion = false;
    this.colorPalette = [
      { r: 36, g: 18, b: 42 },
      { r: 78, g: 36, b: 42 },
      { r: 252, g: 178, b: 96 },
      { r: 253, g: 238, b: 152 },
    ];
    this.color = this.colorVariation(this.randomColor());
    this.currentAlpha = 1;
  }

  update() {
    // Check if particle is still within the canvas
    // If not, mark it for deletion
    if (
      this.x < 0 ||
      this.x > this.game.width ||
      this.y < 0 ||
      this.y > this.game.height
    ) {
      this.markedForDeletion = true;
    }

    this.updateParticleModel(this);
  }

  /**
   * Update the particles x and y coordinates based on its direction and speed
   */
  updateParticleModel(particle: IParticle) {
    const angle = 180 - (this.direction + 90);

    if (particle.direction > 0 && particle.direction < 180) {
      particle.x +=
        (particle.speed * Math.sin(particle.direction)) /
        Math.sin(particle.speed);
    } else {
      particle.x -=
        (particle.speed * Math.sin(particle.direction)) /
        Math.sin(particle.speed);
    }

    if (particle.direction > 90 && particle.direction < 270) {
      particle.y +=
        (particle.speed * Math.sin(angle)) / Math.sin(particle.speed);
    } else {
      particle.y -=
        (particle.speed * Math.sin(angle)) / Math.sin(particle.speed);
    }

    if (this.currentAlpha > 0) {
      this.currentAlpha = Math.max(this.currentAlpha - 0.01, 0);
    }

    return particle;
  }

  colorVariation(color: { r: number; g: number; b: number }, variation = 50) {
    const r = Math.round(Math.random() * variation - variation / 2 + color.r);
    const g = Math.round(Math.random() * variation - variation / 2 + color.g);
    const b = Math.round(Math.random() * variation - variation / 2 + color.b);
    const a = randomBetween(0.3, 1);

    return `rgb(${r}, ${g}, ${b}, ${a})`;
  }

  randomColor() {
    return this.colorPalette[
      Math.floor(Math.random() * this.colorPalette.length)
    ];
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = this.color;
    context.globalAlpha = this.currentAlpha;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
    context.globalAlpha = 1;
  }
}
