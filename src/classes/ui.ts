import { Game } from './game';

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  ammoLevelColor: string;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = 'Press Start 2P';
    this.textColor = 'rgba(215 225 230 / 1)';
    this.ammoLevelColor = 'rgba(222 189 65 / 0.5';
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = this.textColor;
    // context.font = this.fontSize + 'px ' + this.fontFamily;
    context.font = `${this.fontSize}px '${this.fontFamily}'`;
    context.textAlign = 'left';
    context.fillText(`Score: ${this.game.score}`, 20, 40);

    context.restore();
  }
}
