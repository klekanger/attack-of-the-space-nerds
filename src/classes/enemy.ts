import bigEarsImage from '../artwork/bigEars.png';
import enemyShotImage from '../artwork/laserGreenShot.png';
import scaryGeekImage from '../artwork/scaryGeek.png';
import { calculateSineWave, chaseMovement } from '../lib/movements';
import { randomBetween } from '../lib/util';
import type { IEnemy, IGame } from '../types';
import { Explosion1, Hit } from './sfx';

// **************************************
// Main enemy class that all enemies
// are based on
// **************************************
export class Enemy implements IEnemy {
  markedForDeletion: boolean;
  image!: HTMLImageElement;
  x: number;
  xStart: number;
  y: number;
  width: number;
  height: number;
  frame!: number;
  maxFrame!: number;
  speed!: number;
  verticalSpeed!: number;
  multisprite!: boolean;
  lives!: number;
  sfxHit: Hit;
  sfxExplosion: Explosion1;
  canShoot: boolean;
  shootTimer: number;
  shootInterval: number;
  animationTimer: number;
  animationInterval: number;

  constructor(protected readonly game: IGame) {
    this.width = 98;
    this.height = 50;
    this.x = randomBetween(0, this.game.width * 0.8);
    this.xStart = this.x;
    this.y = randomBetween(-200, -this.height);
    this.multisprite = false;
    this.markedForDeletion = false;
    this.sfxHit = new Hit();
    this.sfxExplosion = new Explosion1();
    this.canShoot = true;
    this.shootTimer = randomBetween(1000, 5000);
    this.shootInterval = this.shootTimer;
    this.animationTimer = 0;
    this.animationInterval = 200 / game.fps;
  }

  /**
   * Enemy update method.
   * Logic that runs on every frame.
   *
   * @param delta { number } - Time since last frame
   */
  update(delta: number) {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }

    // ***************************************
    // Different movement for different enemies
    // ***************************************
    if (this instanceof ScaryGeek) {
      const { x, y } = chaseMovement({
        playerX: this.game.player.x,
        playerY: this.game.player.y,
        enemyX: this.x,
        enemyY: this.y,
        speed: 2,
        delta: delta / 10,
        xMultiply: 1 + this.game.level + this.game.gameSpeed,
        yMultiply: 0.5 + this.game.level / 10 + this.game.gameSpeed,
        direction: this.direction,
      });
      this.x = x;
      this.y = y;
    }

    if (this instanceof BigEars) {
      this.y += (this.verticalSpeed + this.game.gameSpeed) * delta;
      this.x = calculateSineWave({
        yPosition: this.y,
        xStart: this.xStart,
        viewportWidth: this.game.width - 100,
      });
    }

    // Reached bottom of screen, mark for deletion
    if (this.y > this.game.height) this.markedForDeletion = true;

    // Increase frame to animate the enemies
    if (this.animationTimer > this.animationInterval) {
      this.frame = (this.frame + 1) % this.maxFrame;
      this.animationTimer = 0;
    } else {
      this.animationTimer++;
    }
  }

  /**
   * Enemy draw method.
   * Draws the enemy on the canvas.
   *
   * @param context { CanvasRenderingContext2D } - canvas context
   */
  draw(context: CanvasRenderingContext2D) {
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
    if (this.game.audioEnabled) this.sfxHit.play();
  }

  playExplosionSound() {
    if (this.game.audioEnabled) this.sfxExplosion.play();
  }
}

// **************************************
// Enemy - ScaryGeek
// **************************************
export class ScaryGeek extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;
  direction: number;

  constructor(game: IGame) {
    super(game);
    this.speed = randomBetween(0.05, 0.1);
    this.verticalSpeed = randomBetween(0.02, 0.1) + this.game.level / 20;
    this.width = 68;
    this.height = 100;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = true;
    this.image = new Image();
    this.image.src = scaryGeekImage;
    this.lives = 3;
    this.score = this.lives;
    this.direction = Math.random() < 0.5 ? -1 : 1;
  }
}

// **************************************
// Enemy2 - BigEars
// **************************************
export class BigEars extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;

  constructor(game: IGame) {
    super(game);
    this.speed = randomBetween(0.05, 0.1);
    this.verticalSpeed = randomBetween(0.02, 0.1) + this.game.level / 100;
    this.width = 68;
    this.height = 120;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = true;
    this.image = new Image();
    this.image.src = bigEarsImage;
    this.lives = 2;
    this.score = this.lives;
    this.canShoot = false;
  }
}

// **************************************
// Enemy Bombs
// **************************************
export class EnemyBomb extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;

  constructor(game: IGame, enemyX: number, enemyY: number) {
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
    this.y += this.verticalSpeed * delta;
    if (this.y > this.game.height) this.markedForDeletion = true;

    // Sprite animation
    this.frame = this.frame < this.maxFrame ? (this.frame + 1) * delta : 0;
  }
}
