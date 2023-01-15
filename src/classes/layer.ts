import { Game } from './game';

export class Layer {
  game: Game;
  image: HTMLImageElement;
  speed: number;
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(game: Game, image: HTMLImageElement, speed: number) {
    this.game = game;
    this.image = image;
    this.speed = speed;
    this.width = 960;
    this.height = 3200;
    this.x = 0;
    this.y = 0;
  }

  update(delta: number) {
    if (this.y >= this.height) this.y = 0;
    this.y = this.y + this.speed * delta;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
    context.drawImage(this.image, this.x, this.y - this.height);
  }
}
