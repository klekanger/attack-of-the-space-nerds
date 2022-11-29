import { Game } from './game';
import alien1Image from '../artwork/nerd1.png';
import { Explosion1, Hit } from './sfx';
import { EnemyProjectile } from './projectile';
import enemyShotImage from '../artwork/laserGreenShot.png';
import { randomBetween } from '../lib/util';

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
  speedModifier!: number;
  projectiles: EnemyProjectile[];
  multisprite!: boolean;
  lives!: number;
  sfxHit: Hit;
  sfxExplosion: Explosion1;
  canShoot: boolean;

  constructor(game: Game) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = randomBetween(10, this.game.width * 0.9);
    this.y = randomBetween(-200, -this.height);
    this.multisprite = false;
    this.markedForDeletion = false;
    this.projectiles = [];
    this.sfxHit = new Hit();
    this.sfxExplosion = new Explosion1();
    this.canShoot = true;
  }

  // ***************************************
  // update method
  // Game logic that runs on every frame
  // ***************************************
  update(delta: number) {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }
    this.x += this.speed * delta * this.speedModifier;

    this.y += this.verticalSpeed * delta * this.speedModifier;
    /* this.x += this.speed * this.speedModifier * delta;
    this.y += this.verticalSpeed * this.speedModifier * delta; */

    if (this.y > this.game.height) this.markedForDeletion = true;

    // Sprite animation

    if (this.frame < this.maxFrame) {
      this.frame++;
    } else {
      this.frame = 0;
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
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });

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
    this.speed = randomBetween(100, 1000);
    this.verticalSpeed = randomBetween(100, 300);
    this.speedModifier = 0.5;
    this.width = 68;
    this.height = 100;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = true;
    this.image = new Image();
    this.image.src = alien1Image;
    this.lives = 2;
    this.score = this.lives;
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
    this.speed = 0;
    this.verticalSpeed = randomBetween(100, 300);
    this.speedModifier = 0.5;
    this.width = 56;
    this.height = 54;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = false;
    this.image = new Image();
    this.image.src = enemyShotImage;
    this.lives = 2;
    this.score = this.lives;
    this.canShoot = false;
  }

  // We'll override the update method for enemy bombs, as they will move and behave differently
  update(delta: number): void {
    this.y += this.verticalSpeed * delta * this.speedModifier;

    if (this.y > this.game.height) this.markedForDeletion = true;

    // Sprite animation

    if (this.frame < this.maxFrame) {
      this.frame++;
    } else {
      this.frame = 0;
    }
  }
}

// TODO
// Move playHitSound and playExplosionSound to main Enemy class.
// Add the relevant sfx to the constructor for each of the child classes and use this as param for playHitSound and playExplosionSound
