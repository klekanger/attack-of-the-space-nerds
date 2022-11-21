import { Game } from './game';
import enemyShipImage from '../artwork/enemyShip.png';
import { Explosion1, Hit } from './sfx';
import { EnemyProjectile } from './projectile';

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
  speed!: number;
  verticalSpeed!: number;
  speedModifier!: number;
  projectiles: EnemyProjectile[];

  constructor(game: Game) {
    this.game = game;
    this.width = 98;
    this.height = 50;
    this.x = Math.random() * (this.game.width * 0.95 - this.width);
    this.y = Math.random() * this.height * 4 - this.height * 5;
    this.markedForDeletion = false;
    this.projectiles = [];
  }

  // ***************************************
  // update method
  // Game logic that runs on every frame
  // ***************************************
  update() {
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
  }

  draw(context: CanvasRenderingContext2D) {
    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });

    context.drawImage(this.image, this.x, this.y);
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
  speed: number;
  verticalSpeed: number;
  speedModifier: number;
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
    this.image = new Image();
    this.image.src = enemyShipImage;
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
