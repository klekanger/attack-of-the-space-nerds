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

    if (this.game.debug) {
      context.font = `20px 'Arial'`;
      context.fillStyle = '#EBF48D';
      context.fillText(`gameTime: ${this.game.gameTime.toFixed(1)}`, 20, 80);
      context.fillText(`fps: ${this.game.fps.toFixed(1)}`, 20, 110);

      context.fillRect(120, 97, this.game.fps * 4, 10);
      context.fillText(
        `background speed: ${this.game.background.layer1.speed}`,
        20,
        140
      );

      context.fillText(
        `shootTimer: ${this.game.player.shootTimer.toFixed(1)}`,
        20,
        200
      );
    }

    context.restore();
  }
}
