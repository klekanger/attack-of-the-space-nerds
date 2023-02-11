import { Game } from './classes/game';

window.addEventListener('load', function () {
  // Set up main game canvas
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 900;

  const game = new Game(canvas, context);

  let previousTimeStamp: number = 0;
  let delta: number = 0;
  let totalTime: number = 0;

  // *******************
  // Game animation loop
  // *******************
  function gameLoop(timestamp: number) {
    delta = timestamp - previousTimeStamp;
    previousTimeStamp = timestamp;
    totalTime += delta;

    // Mostly for debugging purposes
    game.fps = Math.round(1000 / delta);
    game.gameTime = totalTime / 1000;

    switch (game.getGameMode()) {
      case 'IDLE':
        if (context) game.splashScreen.draw(context);
        game.splashScreen.update();
        break;

      case 'DIETRANSITION':
        game.explodeAllEnemies(); // Clears all enemies and particles

      default: // PLAYING
        game.update(delta);
        if (context !== null) game.draw(context);
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});
