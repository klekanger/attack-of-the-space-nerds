import playerImage from '../artwork/player.png';
import type { IGame, IUi } from '../types';

export class Ui implements IUi {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  playerImage: HTMLImageElement;

  constructor(private readonly game: IGame) {
    this.fontSize = 25;
    this.fontFamily = 'Press Start 2P';
    this.textColor = 'rgba(215 225 230 / 1)';
    this.playerImage = new Image();
    this.playerImage.src = playerImage;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px '${this.fontFamily}'`;
    context.textAlign = 'left';

    context.fillText(`Score: ${this.game.score}`, 20, 40);
    context.fillText(`Level: ${this.game.level}`, 20, 80);

    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(
        this.playerImage,
        this.game.width - i * 50 - 70,
        30,
        30,
        30
      );
    }

    // Draw game over text on canvas

    if (this.game.gameMode === 'GAMEOVER') {
      context.font = `50px '${this.fontFamily}'`;
      context.fillStyle = 'rgba(255 255 255 / 0.6)';
      context.textAlign = 'center';
      context.fillText(
        'Game Over',
        this.game.width / 2,
        this.game.height / 2 - 60
      );
      context.font = `20px '${this.fontFamily}'`;
      context.fillStyle = 'rgba(156	125	1	/ 0.6)';
      context.fillText(
        'Press P to play again',
        this.game.width / 2,
        this.game.height / 2
      );
    }

    // Draw transition text when life is lost
    if (this.game.gameMode === 'DIETRANSITION') {
      context.font = `50px '${this.fontFamily}'`;
      context.fillStyle = 'rgba(255 255 255 / 0.6)';
      context.textAlign = 'center';
      context.fillText(
        'Life lost',
        this.game.width / 2,
        this.game.height / 2 - 60
      );
      context.font = `20px '${this.fontFamily}'`;
      context.fillStyle = 'rgba(156	125	1	/ 0.6)';
      context.fillText('Try again', this.game.width / 2, this.game.height / 2);
    }

    context.restore();
  }
}
