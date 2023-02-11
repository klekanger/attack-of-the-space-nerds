import { Game } from './classes/game';
import { SplashScreen } from './classes/splashScreen';
import splashImage from './artwork/attack-of-the-space-nerds-splash-screen.webp';

window.addEventListener('load', function () {
  // Set up main game canvas
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 900;

  const game = new Game(canvas.width, canvas.height);

  const splashScreen = new SplashScreen({
    width: canvas.width,
    height: canvas.height,
    canvas: canvas,
  });
  splashScreen.setSplashScreenImage(splashImage);

  // *******************
  // Game animation loop
  // *******************
  let previousTimeStamp: number = 0;
  let delta: number = 0;
  let totalTime: number = 0;
  let splashHasBeenDrawn: boolean = false;

  function gameLoop(timestamp: number) {
    delta = timestamp - previousTimeStamp;
    previousTimeStamp = timestamp;
    totalTime += delta;

    // kommentar

    // Mostly for debugging purposes
    game.fps = Math.round(1000 / delta);
    game.gameTime = totalTime / 1000;

    switch (game.getGameMode()) {
      case 'IDLE':
        if (context !== null && !splashHasBeenDrawn) {
          splashHasBeenDrawn = true;
          context.clearRect(0, 0, canvas.width, canvas.height);
          splashScreen.splashImage.onload = () => {
            splashScreen.draw(context);
          };
        }
        if (context) splashScreen.draw(context);
        splashScreen.update();
        break;

      case 'DIETRANSITION':
        game.explodeAllEnemies(); // Clears all enemies and particles

      default:
        // We're not on splash screen anymore, run game logic
        splashHasBeenDrawn = false;
        game.update(delta);
        if (context !== null) game.draw(context);
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});
