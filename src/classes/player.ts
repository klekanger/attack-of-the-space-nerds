import { Game } from './game';
import { Projectile } from './projectile';
import playerImageLeft from '../artwork/playerLeft.png';
import playerImage from '../artwork/player.png';
import playerImageRight from '../artwork/playerRight.png';

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
  projectiles: Projectile[];
  shootTimer: number;
  shotsPerSecond: number;

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
  }

  update(delta: number) {
    // Handle horizontal spaceship movement
    if (this.game.keys.includes('ArrowLeft')) {
      this.speedX = -this.maxSpeed;
      this.imageToDraw = this.playerImages[0];
      this.width = 90;
      this.height = 77;
      this.xOffset = 4.5;
    } else if (this.game.keys.includes('ArrowRight')) {
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
    if (this.game.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x - 5 + this.width / 2)
      );
    }
  }
}
