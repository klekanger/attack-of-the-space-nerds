import { Game } from './game';
import alien1Image from '../artwork/nerd1.png';
import { Explosion1, Hit } from './sfx';
import { EnemyProjectile } from './projectile';
import { easeInOutSine } from '../lib';

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

  constructor(game: Game) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = Math.random() * (this.game.width * 0.95 - this.width);
    this.y = Math.random() * this.height * 4 - this.height * 5;
    this.multisprite = false;
    this.markedForDeletion = false;
    this.projectiles = [];
  }

  // ***************************************
  // update method
  // Game logic that runs on every frame
  // ***************************************
  update(delta: number, gameTime: number) {
    if (this.x <= 0 || this.x >= this.game.width - this.width) {
      this.speed = -this.speed;
    }
    this.x += this.speed * this.speedModifier;
    this.y += this.verticalSpeed * this.speedModifier;

    if (this.y > this.game.height) this.markedForDeletion = true;

    // Let the enemies shoot
    this.projectiles.forEach((projectile) => {
      projectile.update();
    });

    if (Math.random() * 1000 > 995) this.shoot();

    // Sprite animation

    if (this.frame < this.maxFrame) {
      this.frame++;
    } else {
      this.frame = 0;
    }

    // Easing of the enemys X position

    // this.x = easeInOutSine(gameTime / 1000, 10, this.game.width - 100, 2);
  }

  draw(context: CanvasRenderingContext2D) {
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

  shoot() {
    this.projectiles.push(
      new EnemyProjectile(this.game, this.x - 5 + this.width / 2, this.y)
    );
  }
}

// **************************************
// Enemy - ScaryGeek
// **************************************
export class ScaryGeek extends Enemy {
  lives: number;
  score: number;
  image: HTMLImageElement;
  sfxHit: Hit;
  sfxExplosion: Explosion1;

  constructor(game: Game) {
    super(game);
    this.speed = Math.random() * -4.5 - 4.5;
    this.verticalSpeed = Math.random() * 4 + 1;
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
    this.sfxHit = new Hit();
    this.sfxExplosion = new Explosion1();
  }

  playHitSound() {
    this.sfxHit.play();
  }

  playExplosionSound() {
    this.sfxExplosion.play();
  }
}
