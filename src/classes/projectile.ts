import { Game } from './game';
import projectileImage from '../artwork/laserGreen.png';

export class Projectile {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  markedForDeletion: boolean;
  image: HTMLImageElement;

  constructor(game: Game, x: number) {
    this.game = game;
    this.x = x;
    this.y = this.game.height - this.game.player.height;
    this.width = 10;
    this.height = 3;
    this.speed = 20;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = projectileImage;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) this.markedForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
  }
}
