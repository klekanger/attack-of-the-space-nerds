import { Game } from './game';

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  textColor: string;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = 'Press Start 2P';
    this.textColor = 'rgba(215 225 230 / 1)';
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px '${this.fontFamily}'`;
    context.textAlign = 'left';

    context.fillText(`Score: ${this.game.score}`, 20, 40);
    context.fillText(`Lives: ${this.game.lives}`, this.game.width - 220, 40);

    context.restore();
  }
}
