import { Game } from './game';

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  color: string;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = 'Press Start 2P';
    this.color = 'white';
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = this.color;
    // context.font = this.fontSize + 'px ' + this.fontFamily;
    context.font = `${this.fontSize}px '${this.fontFamily}'`;
    context.textAlign = 'left';
    context.fillText(`Score: ${this.game.score}`, 20, 40);
    context.restore();
  }
}