import { Game } from './game';
import { PlayerProjectile } from './projectile';
import playerImageLeft from '../artwork/playerLeft.png';
import playerImage from '../artwork/player.png';
import playerImageRight from '../artwork/playerRight.png';
import { PlayerExplosion, Shoot } from './sfx';

export class Player {
  game: Game;
  width: number;
  height: number;
  xOffset: number;
  x: number;
  y: number;
  speedX: number;
  maxSpeed: number;
  playerImages: HTMLImageElement[];
  imageToDraw: HTMLImageElement;
  projectiles: PlayerProjectile[];
  shootTimer: number;
  shotsPerSecond: number;
  sfxShoot: Shoot;
  sfxPlayerExplosion: PlayerExplosion;
  flash: boolean;
  playerAlpha: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 99;
    this.height = 75;
    this.xOffset = 4.5;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - 100;
    this.speedX = 0;
    this.maxSpeed = 0.5;
    this.playerImages = [new Image(), new Image(), new Image()];
    this.playerImages[0].src = playerImageLeft;
    this.playerImages[1].src = playerImage;
    this.playerImages[2].src = playerImageRight;
    this.imageToDraw = this.playerImages[1];
    this.projectiles = [];
    this.shootTimer = 0;
    this.shotsPerSecond = 5;
    this.sfxShoot = new Shoot();
    this.sfxPlayerExplosion = new PlayerExplosion();
    this.flash = false;
    this.playerAlpha = 1;
  }

  update(delta: number) {
    // Handle horizontal spaceship movement
    if (this.game.keys.includes('ArrowLeft') || this.game.keys.includes('a')) {
      this.speedX = -this.maxSpeed;
      this.imageToDraw = this.playerImages[0];
      this.width = 90;
      this.height = 77;
      this.xOffset = 4.5;
    } else if (
      this.game.keys.includes('ArrowRight') ||
      this.game.keys.includes('d')
    ) {
      this.speedX = this.maxSpeed;
      this.imageToDraw = this.playerImages[2];
      this.width = 90;
      this.height = 77;
      this.xOffset = 4.5;
    } else {
      this.speedX = 0;
      this.xOffset = 0;
      this.imageToDraw = this.playerImages[1];
    }

    this.x += this.speedX * delta;

    // Handle player shooting
    if (delta) this.shootTimer += delta;

    if (
      this.game.keys.includes(' ') &&
      this.shootTimer > 1000 / this.shotsPerSecond
    ) {
      this.game.player.shoot();

      this.shootTimer = 0;
    }

    this.projectiles.forEach((projectile) => {
      projectile.update(delta);
    });
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );

    // Horizontal boundaries
    if (this.x < 5) this.x = 5;
    if (this.x > this.game.width - this.width - 5)
      this.x = this.game.width - this.width - 5;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'white';
    if (this.game.debug) {
      context.strokeStyle = 'white';
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });

    if (this.playerAlpha > 0 && this.game.getGameMode() === 'DIETRANSITION') {
      this.playerAlpha = this.playerAlpha - 0.05;
      context.globalAlpha = this.playerAlpha;
    }
    if (this.game.getGameMode() === 'PLAYING') {
      context.globalAlpha = 1;
      this.playerAlpha = 1;
    }

    context.drawImage(this.imageToDraw, this.x + this.xOffset, this.y);
    context.globalAlpha = 1;
  }

  shoot() {
    this.projectiles.push(
      new PlayerProjectile(this.game, this.x - 5 + this.width / 2)
    );
    this.sfxShoot.play();
  }
}
