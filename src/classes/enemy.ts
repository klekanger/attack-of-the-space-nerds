import bigEarsImage from "../artwork/bigEars.png";
import scaryGeekImage from "../artwork/scaryGeek.png";
import { IEnemy, IGame } from "../types";
import { Explosion1, Hit } from "./sfx";

import enemyShotImage from "../artwork/laserGreenShot.png";
import { calculateSineWave, chaseMovement } from "../lib/movements";
import { randomBetween } from "../lib/util";

// **************************************
// Main enemy class that all enemies
// are based on
// **************************************
export class Enemy implements IEnemy {
  game: IGame;
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
  hitDamage: number;
  canShoot: boolean;
  shootTimer: number;
  shootInterval: number;
  animationTimer: number;
  animationInterval: number;

  constructor(game: IGame) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = randomBetween(0, this.game.width * 0.8);
    this.xStart = this.x;
    this.y = randomBetween(-200, -this.height);
    this.multisprite = false;
    this.markedForDeletion = false;
    this.sfxHit = new Hit();
    this.sfxExplosion = new Explosion1();
    this.hitDamage = 1;
    this.canShoot = true;
    this.shootTimer = randomBetween(1000, 5000);
    this.shootInterval = this.shootTimer;
    this.animationTimer = 0;
    this.animationInterval = 100 / game.fps;
  }

  // ***************************************
  // update method
  // Game logic that runs on every frame
  // ***************************************
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
        yMultiply: 0.5,
      });
      this.x = x;
      this.y = y;
    }

    if (this instanceof BigEars) {
      this.y = this.y + (this.verticalSpeed + this.game.gameSpeed) * delta;
      this.x = calculateSineWave({
        yPosition: this.y,
        xStart: this.xStart,
        viewportWidth: this.game.width - 100,
      });
    }

    // Out of bounds, mark for deletion
    if (this.y > this.game.height) this.markedForDeletion = true;

    // increase frame to animate the enemies
    if (this.animationTimer > this.animationInterval) {
      this.frame = (this.frame + 1) % this.maxFrame;
      this.animationTimer = 0;
    } else {
      this.animationTimer++;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug) {
      context.font = "20px Helvetica";

      context.fillStyle = "#EBF48D";
      context.fillText(`Lives: ${this.lives.toString()}`, this.x, this.y);

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
    this.lives = 2;
    this.score = this.lives;
    this.hitDamage = 0.2;
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
    this.verticalSpeed = randomBetween(0.02, 0.1) + this.game.level / 20;
    this.width = 68;
    this.height = 120;
    this.maxFrame = 23;
    this.frame = Math.floor(Math.random() * this.maxFrame);
    this.multisprite = true;
    this.image = new Image();
    this.image.src = bigEarsImage;
    this.lives = 2;
    this.score = this.lives;
    this.hitDamage = 0.2;
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

// TODO
// Need better sinus waves for the enemies, or other movement patterns
