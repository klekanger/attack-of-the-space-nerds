import { Game } from './classes/game';
import startScreenMusic from './audio/Raining Bits.ogg';
import { GameMode } from './types';

window.addEventListener('load', function () {
  const htmlToHideDuringPlay: NodeListOf<HTMLElement> =
    document.querySelectorAll('.hide-during-play');

  const introMusic = new Audio();
  introMusic.src = startScreenMusic;
  introMusic.loop = true;
  introMusic.play();

  // Set up main game canvas
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 900;

  const game = new Game(canvas, context);

  const playButton = document.getElementById('btn-play') as HTMLButtonElement;

  playButton.addEventListener('click', () => {
    console.log('clicked');
    game.setGameMode(GameMode.PLAYING);
  });

  let isStartTextVisible = true;

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
        // Hide splash screen text
        if (!isStartTextVisible) {
          console.log('shwoing');
          showAllElements(htmlToHideDuringPlay);
          isStartTextVisible = true;
        }

        game.splashScreen.update();
        break;

      case 'DIETRANSITION':
        game.explodeAllEnemies(); // Clears all enemies and particles

      default: // PLAYING
        game.update(delta);
        if (context !== null) game.draw(context);
        if (isStartTextVisible) {
          console.log('hiding');
          hideAllElements(htmlToHideDuringPlay);
          isStartTextVisible = false;
        }
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});

function hideAllElements(element: NodeListOf<HTMLElement>) {
  element.forEach((e) => {
    e.classList.add('hidden');
  });
}

function showAllElements(element: NodeListOf<HTMLElement>) {
  element.forEach((e) => {
    e.classList.remove('hidden');
  });
}
