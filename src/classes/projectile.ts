import { Game } from './game';

export class Projectile {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  markedForDeletion: boolean;
  image: HTMLImageElement;

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = this.game.height - this.game.player.height;
    this.width = 10;
    this.height = 3;
    this.speed = 20;
    this.markedForDeletion = false;
    this.image = document.getElementById('projectile') as HTMLImageElement;
  }

  update() {
    this.y -= this.speed;

    if (this.y < 0) this.markedForDeletion = true;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y);
  }
}
