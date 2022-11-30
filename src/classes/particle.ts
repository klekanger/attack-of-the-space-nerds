import { Game } from './game';

export class Particle {
  game: Game;
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  direction: number;
  markedForDeletion: boolean;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x || Math.round(Math.random() * game.width);
    this.y = y || Math.round(Math.random() * game.height);
    this.radius = Math.ceil(Math.random() * 10);
    this.color = 'rgba(255, 241, 74, 0.6)';
    this.speed = Math.pow(Math.ceil(Math.random() * 40) + 10, 0.7);
    this.direction = Math.round(Math.random() * 360);
    this.markedForDeletion = false;
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

  #updateParticleModel(particle) {
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

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }
}

// https://codepen.io/deanwagman/pen/EjLBdQ?editors=1011
