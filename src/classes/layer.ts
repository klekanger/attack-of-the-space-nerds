import { IGame, ILayer } from "../types";

export class Layer implements ILayer {
  game: IGame;
  image: HTMLImageElement;
  speed: number;
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(game: IGame, image: HTMLImageElement, speed: number) {
    this.game = game;
    this.image = image;
    this.speed = speed;
    this.width = game.width;
    this.height = game.height * 2;
    this.x = 0;
    this.y = 0;

    console.log("game width", this.width);
    console.log("game height", this.height);
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
