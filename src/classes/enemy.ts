import { Game } from './game';
import alien1Image from '../artwork/nerd1.png';
import { Explosion1, Hit } from './sfx';

import enemyShotImage from '../artwork/laserGreenShot.png';
import { randomBetween, makeRandomPositiveOrNegative } from '../lib/util';

// **************************************
// Main enemy class that all enemies
// are based on
// **************************************
export class Enemy {
  game: Game;
  markedForDeletion: boolean;
  image!: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  frame!: number;
  maxFrame!: number;
  speed!: number;
  verticalSpeed!: number;
  // speedModifier!: number;
  multisprite!: boolean;
  lives!: number;
  sfxHit: Hit;
  sfxExplosion: Explosion1;
  hitDamage: number;
  canShoot: boolean;
  animationTimer: number;
  animationInterval: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = randomBetween(10, this.game.width * 0.8);
    this.y = randomBetween(-200, -this.height);
    this.multisprite = false;
    this.markedForDeletion = false;
    this.sfxHit = new Hit();
    this.sfxExplosion = new Explosion1();
    this.hitDamage = 1;
    this.canShoot = true;
    this.animationTimer = 0;
    this.animationInterval = 1000 / game.fps;
  }

  // ***************************************
  // update method
  // Game logic that runs on every frame
  // ***************************************
  update(delta: number) {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }
    //this.x = (this.x + this.speed) * delta;
    //this.y = (this.y + this.verticalSpeed) * delta;
    this.x = this.x + this.speed * delta;
    this.y = this.y + this.verticalSpeed * delta;

    if (this.y > this.game.height) this.markedForDeletion = true;

    // increase frame, take delta into account

    if (this.animationTimer > this.animationInterval) {
      this.frame = (this.frame + 1) % this.maxFrame;
      this.animationTimer = 0;
    } else {
      this.animationTimer = (this.animationTimer + 1) * delta;
    }

    // Easing of the enemys X position

    // this.x = easeInOutSine(this.y, 10, this.game.width - 100, 2);
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug) {
      context.font = '20px Helvetica';
      context.strokeStyle = 'white';
      context.fillText(`Lives: ${this.lives.toString()}`, this.x, this.y);
      context.fillText(
        `Y Speed: ${Math.floor(this.verticalSpeed).toString()}`,
        this.x,
        this.y - 15
      );
      context.fillText(
        `this.frame: ${Math.floor(this.frame).toString()}`,
        this.x,
        this.y - 30
      );

      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    if (this.multisprite)
      context.drawImage(
        this.image,
        this.frame * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    else context.drawImage(this.image, this.x, this.y);
  }

  playHitSound() {
    this.sfxHit.play();
  }

  playExplosionSound() {
    this.sfxExplosion.play();
  }
}

// **************************************
// Enemy - ScaryGeek
// **************************************
export class ScaryGeek extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;

  constructor(game: Game) {
    super(game);
    this.speed = makeRandomPositiveOrNegative(randomBetween(0.1, 0.3));
    this.verticalSpeed = randomBetween(0.1, 0.3);
    this.width = 68;
    this.height = 100;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = true;
    this.image = new Image();
    this.image.src = alien1Image;
    this.lives = 2;
    this.score = this.lives;
    this.hitDamage = 0.2;
  }
}

// **************************************
// Enemy Bombs
// **************************************

export class EnemyBomb extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;

  constructor(game: Game, enemyX: number, enemyY: number) {
    super(game);
    this.x = enemyX;
    this.y = enemyY;
    this.verticalSpeed = randomBetween(0.1, 0.4);
    this.width = 56;
    this.height = 54;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = false;
    this.image = new Image();
    this.image.src = enemyShotImage;
    this.lives = 1;
    this.score = this.lives;
    this.canShoot = false;
  }

  // We'll override the update method for enemy bombs, as they will move and behave differently
  update(delta: number): void {
    this.y = this.y + this.verticalSpeed * delta;

    if (this.y > this.game.height) this.markedForDeletion = true;

    // Sprite animation

    if (this.frame < this.maxFrame) {
      this.frame = (this.frame + 1) * delta;
    } else {
      this.frame = 0;
    }
  }
}
