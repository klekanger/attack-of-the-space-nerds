import projectileImage from "../artwork/laserGreen.png";
import { IGame, IProjectile } from "../types";

export class Projectile implements IProjectile {
  game: IGame;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction!: "up" | "down";
  selectDirection: {
    [key: string]: number;
  };
  markedForDeletion: boolean;
  image: HTMLImageElement;

  constructor(game: IGame, x: number) {
    this.game = game;
    this.x = x;
    this.y = this.game.height - this.game.player.height;
    this.width = 10;
    this.height = 3;
    this.speed = 1;
    this.image = new Image();
    this.markedForDeletion = false;
    this.selectDirection = {
      up: 1,
      down: -1,
    };
  }

  update(delta: number) {
    const changeDirection = this.selectDirection[this.direction];

    this.y -= this.speed * delta * changeDirection;

    if (
      (changeDirection === 1 && this.y < 0) ||
      (changeDirection === -1 && this.y > this.game.height)
    ) {
      this.markedForDeletion = true;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y);
  }
}

export class PlayerProjectile extends Projectile {
  constructor(game: IGame, x: number) {
    super(game, x);
    this.direction = "up";
    this.image.src = projectileImage;
  }
}
