import '@fortawesome/fontawesome-free/css/all.css';
import startScreenMusic from './audio/Raining Bits.mp3';
import { Game } from './classes/game';
import { introScreenHtml } from './html/intro';
import { preIntroScreenHtml } from './html/pre-intro';
import { FA_AUDIO_OFF, FA_AUDIO_ON } from './html/speaker-symbols';
import { setupIntroScreen } from './setup-intro-screen';
import { GameMode } from './types';

window.addEventListener('load', function () {
  // Set up main game canvas
  const canvas: HTMLCanvasElement = document.querySelector('#canvas1')!;
  const context = canvas.getContext('2d')!;
  canvas.width = 960;
  canvas.height = 1600;

  // Create game instance
  // Almost all game logic is contained in the Game class
  const game = new Game(canvas, context);
  // Start on the pre-intro-screen so that the user can interact with the page to be able to start the music
  game.gameMode = GameMode.INTRO;

  // Show the pre-intro screen with audio/no audio buttons
  const introPlaceholder: HTMLElement = document.querySelector('#intro')!;
  introPlaceholder.innerHTML = preIntroScreenHtml;

  const container: HTMLElement = document.querySelector('#container')!;
  if (container) {
    container.style.width = `${canvas.clientWidth}px`;
    container.style.height = `${canvas.clientHeight}px`;
  }

  const startWithAudioBtn: HTMLButtonElement =
    document.querySelector('#btn-audio-yes')!;
  const startWithNoAudioBtn: HTMLButtonElement =
    document.querySelector('#btn-audio-no')!;

  // Initialize intro screen music
  const introMusic = new Audio();
  introMusic.src = startScreenMusic;
  introMusic.loop = true;

  // Event listener for play with AUDIO button
  startWithAudioBtn.addEventListener('click', () => {
    const audioToggleButton: HTMLElement =
      document.querySelector('#speaker-symbol')!;
    audioToggleButton.innerHTML = FA_AUDIO_ON;
    game.audioEnabled = true;
    game.gameMode = GameMode.IDLE;
    game.audioEnabled = true;
    setupIntroScreen({
      introPlaceholder,
      introMusic,
      introScreenHtml,
      game,
    });
  });

  // Event listener for play with NO AUDIO button
  startWithNoAudioBtn.addEventListener('click', () => {
    const audioToggleButton: HTMLElement =
      document.querySelector('#speaker-symbol')!;
    audioToggleButton.innerHTML = FA_AUDIO_OFF;
    game.audioEnabled = false;

    game.gameMode = GameMode.IDLE;
    game.audioEnabled = false;
    setupIntroScreen({
      introPlaceholder,
      introMusic,
      introScreenHtml,
      game,
    });
  });

  let previousTimeStamp = 0;
  let delta = 0;

  // *******************
  // Game animation loop
  // *******************
  function gameLoop(timestamp: number) {
    delta = timestamp - previousTimeStamp;
    previousTimeStamp = timestamp;
    game.fps = Math.round(1000 / delta);

    const gameMode = game.gameMode;

    // Show pre-intro screen - the user can choose to play with or without audio
    if (gameMode === 'INTRO' && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);
    }

    // Show intro screen
    if (gameMode === 'IDLE' && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);

      if (introMusic.paused && game.audioEnabled) {
        void introMusic.play();
      }

      // WHen returning to the intro screen from game play, we need to set up the intro screen again
      if (introPlaceholder.innerHTML === '') {
        setupIntroScreen({
          introPlaceholder,
          introMusic,
          introScreenHtml,
          game,
        });
      }
    }

    if (gameMode === 'DIETRANSITION' || gameMode === 'GAMEOVER') {
      // Clears all enemies and particles
      if (game.enemyWave.length > 0) game.explodeAllEnemies();
    }

    if (gameMode === 'LEVELTRANSITION') {
      game.update(delta);
      if (context) game.render(context);
      game.levelTransition(delta);
    }

    // We're playing - run update and render methods for normal gameplay
    if (
      gameMode === 'PLAYING' ||
      gameMode === 'DIETRANSITION' ||
      gameMode === 'GAMEOVER'
    ) {
      if (!introMusic.paused) introMusic.pause();

      game.update(delta);
      if (context) game.render(context);
    }

    // Call gameLoop again on the next frame
    requestAnimationFrame(gameLoop);
  }

  // Initial call to gameLoop
  gameLoop(0);
});
