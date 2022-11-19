import { Game } from './game';

export class InputHandler {
  game: Game;

  constructor(game: Game) {
    this.game = game;

    window.addEventListener('keydown', (e) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      } else if (e.key === ' ' && this.game.keys.indexOf(e.key) === -1) {
        this.game.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.game.keys.indexOf(e.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      }
    });
  }
}
