import { Game } from './game';

export class Particle {
  game: Game;
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
  markedForDeletion: boolean;
  color: string;
  colorPalette: { r: number; g: number; b: number }[];

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x || Math.round(Math.random() * game.width);
    this.y = y || Math.round(Math.random() * game.height);
    this.radius = Math.ceil(Math.random() * 10);
    this.speed = Math.pow(Math.ceil(Math.random() * 40) + 10, 0.7);
    this.direction = Math.round(Math.random() * 360);
    this.markedForDeletion = false;
    this.colorPalette = [
      { r: 36, g: 18, b: 42 }, // darkPRPL
      { r: 78, g: 36, b: 42 }, // rockDust
      { r: 252, g: 178, b: 96 }, // solorFlare
      { r: 253, g: 238, b: 152 }, // totesASun
    ];
    this.color = this.#colorVariation(this.#randomColor());
  }

  update() {
    if (
      this.x < 0 ||
      this.x > this.game.width ||
      this.y < 0 ||
      this.y > this.game.width
    ) {
      this.markedForDeletion = true;
    }
    this.#updateParticleModel(this);
  }

  #updateParticleModel(particle: Particle) {
    let angle = 180 - (this.direction + 90);
    particle.direction > 0 && particle.direction < 180
      ? (particle.x +=
          (particle.speed * Math.sin(particle.direction)) /
          Math.sin(particle.speed))
      : (particle.x -=
          (particle.speed * Math.sin(particle.direction)) /
          Math.sin(particle.speed));
    particle.direction > 90 && particle.direction < 270
      ? (particle.y +=
          (particle.speed * Math.sin(angle)) / Math.sin(particle.speed))
      : (particle.y -=
          (particle.speed * Math.sin(angle)) / Math.sin(particle.speed));

    return particle;
  }

  #colorVariation(
    color: { r: number; g: number; b: number },
    variation: number = 50
  ) {
    let r, g, b, a;

    r = Math.round(Math.random() * variation - variation / 2 + color.r);
    g = Math.round(Math.random() * variation - variation / 2 + color.g);
    b = Math.round(Math.random() * variation - variation / 2 + color.b);
    a = Math.random() + 0.5;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  #randomColor() {
    return this.colorPalette[
      Math.floor(Math.random() * this.colorPalette.length)
    ];
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }
}

// https://codepen.io/deanwagman/pen/EjLBdQ?editors=1011
