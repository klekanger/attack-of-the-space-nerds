import type { IGame, ILayer } from '../types';

export class Layer implements ILayer {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(
    protected readonly game: IGame,
    protected readonly image: HTMLImageElement,
    protected readonly speed: number
  ) {
    this.width = game.width;
    this.height = game.height * 2;
    this.x = 0;
    this.y = 0;
  }

  update(delta: number) {
    if (this.y >= this.height) this.y = 0;
    this.y += this.speed * delta;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
    context.drawImage(this.image, this.x, this.y - this.height);
  }
}
