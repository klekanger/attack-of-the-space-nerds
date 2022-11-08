import { Game } from './classes/game';

window.addEventListener('load', function () {
  // Set up main game canvas
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 900;
  /* canvas.width = 960;
  canvas.height = 1600;
 */
  const game = new Game(canvas.width, canvas.height);

  // *******************
  // Game animation loop
  // *******************
  let previousTimeStamp: number;

  function gameLoop(timestamp: number) {
    const delta = timestamp - previousTimeStamp;

    previousTimeStamp = timestamp;

    context?.clearRect(0, 0, canvas.width, canvas.height);
    game.update(delta);
    if (context !== null) game.draw(context);
    requestAnimationFrame(gameLoop);
  }

  gameLoop(0);
});

export {};
