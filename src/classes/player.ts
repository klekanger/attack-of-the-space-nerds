import { Game } from './game';
import { Projectile } from './projectile';

export class Player {
  game: Game;
  width: number;
  height: number;
  x: number;
  y: number;
  speedX: number;
  maxSpeed: number;
  playerImages: HTMLImageElement[];
  /* imageLeft: HTMLImageElement;
  imageRight: HTMLImageElement;*/
  imageToDraw: HTMLImageElement;
  projectiles: Projectile[];

  constructor(game: Game) {
    this.game = game;
    this.width = 99;
    this.height = 75;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - 100;
    this.speedX = 0;
    this.maxSpeed = 8;
    this.playerImages = [
      document.getElementById('playerLeft') as HTMLImageElement,
      document.getElementById('player') as HTMLImageElement,
      document.getElementById('playerRight') as HTMLImageElement,
    ];
    this.imageToDraw = this.playerImages[1];
    this.projectiles = [];
  }

  update(delta: number) {
    // Handle horizontal spaceship movement
    if (this.game.keys.includes('ArrowLeft')) {
      this.speedX = -this.maxSpeed;
      this.imageToDraw = this.playerImages[0];
    } else if (this.game.keys.includes('ArrowRight')) {
      this.speedX = this.maxSpeed;
      this.imageToDraw = this.playerImages[2];
    } else {
      this.speedX = 0;

      this.imageToDraw = this.playerImages[1];
    }

    this.x += this.speedX;

    // Shoot
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
    context.drawImage(this.imageToDraw, this.x, this.y);

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
    });
  }

  shoot() {
    if (this.game.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + this.width / 2, this.y + this.height)
      );
    }
  }
}
