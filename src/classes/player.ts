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

  constructor(game: Game) {
    this.game = game;
    this.width = 99;
    this.height = 75;
    this.xOffset = 4.5;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - 100;
    this.speedX = 0;
    this.maxSpeed = 8;
    this.playerImages = [new Image(), new Image(), new Image()];
    this.playerImages[0].src = playerImageLeft;
    this.playerImages[1].src = playerImage;
    this.playerImages[2].src = playerImageRight;
    this.imageToDraw = this.playerImages[1];
    this.projectiles = [];
    this.shootTimer = 0;
    this.shotsPerSecond = 4;
    this.sfxShoot = new Shoot();
    this.sfxPlayerExplosion = new PlayerExplosion();
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

    this.x += this.speedX;

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
      projectile.update();
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
    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });
    context.drawImage(this.imageToDraw, this.x + this.xOffset, this.y);
  }

  shoot() {
    this.projectiles.push(
      new PlayerProjectile(this.game, this.x - 5 + this.width / 2)
    );
    this.sfxShoot.play();
  }
}
