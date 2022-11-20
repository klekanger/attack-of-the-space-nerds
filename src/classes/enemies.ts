import { Game } from './game';
import enemyShipImage from '../artwork/enemyShip.png';

export class Enemy {
  game: Game;
  markedForDeletion: boolean;
  image!: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  speed!: number;
  verticalSpeed!: number;
  speedModifier!: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = Math.random() * (this.game.width * 0.95 - this.width);
    this.y = Math.random() * this.height * 4 - this.height * 5;
    this.markedForDeletion = false;
  }

  update() {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }
    this.x += this.speed * this.speedModifier;
    this.y += this.verticalSpeed * this.speedModifier;

    if (this.y > this.game.height) this.markedForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
  }
}

export class ScaryGeek extends Enemy {
  speed: number;
  verticalSpeed: number;
  speedModifier: number;
  lives: number;
  score: number;
  image: HTMLImageElement;

  constructor(game: Game) {
    super(game);
    this.speed = Math.random() * -4.5 - 4.5;
    this.verticalSpeed = Math.random() * 4 + 1;
    this.speedModifier = 0.5;
    this.image = new Image();
    this.image.src = enemyShipImage;
    this.lives = 2;
    this.score = this.lives;
  }
}
