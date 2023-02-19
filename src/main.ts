import startScreenMusic from './audio/Raining Bits.ogg';
import { Game } from './classes/game';
import { hideAllElements, isMobile, showAllElements } from './lib/util';
import { GameMode } from './types';

window.addEventListener('load', function () {
  // If mobile device, replace button text with "Tap to Play"
  const playButton = document.getElementById('btn-play') as HTMLButtonElement;
  isMobile()
    ? (playButton.innerText = 'Tap to Play')
    : (playButton.innerText = 'Space to Play');

  // Select elements to hide during game play
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

  playButton.addEventListener('click', () => {
    game.setGameMode(GameMode.PLAYING);
  });

  let isStartTextVisible = true;
  let previousTimeStamp = 0;
  let delta = 0;
  let totalTime = 0;

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

    const gameMode = game.getGameMode();

    if (gameMode === 'IDLE' && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);

      if (introMusic.paused) {
        introMusic.play();
      }

      if (!isStartTextVisible) {
        showAllElements(htmlToHideDuringPlay);
        isStartTextVisible = true;
      }
    }

    if (gameMode === 'DIETRANSITION' || gameMode === 'GAMEOVER') {
      // Clears all enemies and particles
      game.enemyWave.length !== 0 ? game.explodeAllEnemies() : null;
    }

    if (
      gameMode === 'PLAYING' ||
      gameMode === 'DIETRANSITION' ||
      gameMode === 'GAMEOVER'
    ) {
      if (!introMusic.paused) {
        introMusic.pause();
      }

      game.update(delta);

      if (context) game.draw(context);
      if (isStartTextVisible) {
        hideAllElements(htmlToHideDuringPlay);
        isStartTextVisible = false;
      }
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});
