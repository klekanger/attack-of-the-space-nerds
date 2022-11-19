import { Game } from './game';
import enemyShipImage from '../artwork/enemyShip.png';
import { urlToHttpOptions } from 'url';

export class Enemy {
  game: Game;
  speed: number;
  verticalSpeed: number;
  markedForDeletion: boolean;
  image!: HTMLImageElement;
  x!: number;
  y!: number;
  width!: number;

  constructor(game: Game) {
    this.game = game;
    this.speed = Math.random() * -1.5 - 0.5;
    this.verticalSpeed = Math.random() * 2 + 0.1;
    this.markedForDeletion = false;
  }

  update() {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }

    this.x += this.speed;
    this.y += this.verticalSpeed;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
  }
}

export class ScaryGeek extends Enemy {
  x: number;
  y: number;
  lives: number;
  score: number;
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor(game: Game) {
    super(game);
    this.width = 98;
    this.height = 50;
    this.x = Math.random() * (this.game.width * 0.95 - this.width);
    this.y = Math.random() * 100;
    this.image = new Image();
    this.image.src = enemyShipImage;
    this.lives = 2;
    this.score = this.lives;
  }
}
