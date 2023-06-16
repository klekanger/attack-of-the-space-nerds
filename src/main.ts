import "@fortawesome/fontawesome-free/css/all.css";
import { Game } from "./classes/game";
import { introScreenHTML } from "./html/intro";
import { preIntroScreenHTML } from "./html/pre-intro";

import { GameMode } from "./types";

import startScreenMusic from "./audio/Raining Bits.mp3";
import { setupIntroScreen } from "./setupIntroScreen";

export const FA_AUDIO_OFF = `<i class="fa-solid fa-volume-xmark"></i>`;
export const FA_AUDIO_ON = `<i class="fa-solid fa-volume-high"></i>`;

window.addEventListener("load", function () {
  // Set up main game canvas
  const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  canvas.width = 960;
  canvas.height = 1600;

  // Create game instance
  // Almost all game logic is contained in the Game class
  const game = new Game(canvas, context);
  game.setGameMode(GameMode.INTRO); // Start on the pre-intro-screen so that the user can interact with the page to be able to start the music

  const introPlaceholder = document.getElementById("intro") as HTMLElement;

  // Show the pre-intro screen with audio/no audio buttons
  introPlaceholder.innerHTML = preIntroScreenHTML;

  const container = document.getElementById("container") as HTMLElement;
  if (container) {
    container.style.width = `${canvas.clientWidth}px`;
    container.style.height = `${canvas.clientHeight}px`;
  }

  this.addEventListener("resize", () => {
    const container = document.getElementById("container") as HTMLElement;

    if (container) {
      container.style.width = `${canvas.clientWidth}px`;
      container.style.height = `${canvas.clientHeight}px`;
    }
  });

  const startWithAudioBtn = document.getElementById(
    "btn-audio-yes"
  ) as HTMLButtonElement;
  const startWithNoAudioBtn = document.getElementById(
    "btn-audio-no"
  ) as HTMLButtonElement;

  // Initialize intro screen music
  const introMusic = new Audio();
  introMusic.src = startScreenMusic;
  introMusic.loop = true;

  // Event listener for play with AUDIO button
  startWithAudioBtn.addEventListener("click", () => {
    const audioToggleButton = document.getElementById(
      "speaker-symbol"
    ) as HTMLElement;
    audioToggleButton.innerHTML = FA_AUDIO_ON;
    game.setAudioEnabled(true);

    game.setGameMode(GameMode.IDLE);
    game.setAudioEnabled(true);
    setupIntroScreen({
      introPlaceholder,
      introMusic,
      introScreenHTML,
      game,
    });
  });

  // Event listener for play with NO AUDIO button
  startWithNoAudioBtn.addEventListener("click", () => {
    const audioToggleButton = document.getElementById(
      "speaker-symbol"
    ) as HTMLElement;
    audioToggleButton.innerHTML = FA_AUDIO_OFF;
    game.setAudioEnabled(false);

    game.setGameMode(GameMode.IDLE);
    game.setAudioEnabled(false);
    setupIntroScreen({
      introPlaceholder,
      introMusic,
      introScreenHTML,
      game,
    });
  });

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

    if (gameMode === "INTRO" && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);
    }

    if (gameMode === "IDLE" && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);

      if (introMusic.paused && game.getAudioEnabled() === true) {
        introMusic.play();
      }

      if (introPlaceholder.innerHTML === "") {
        setupIntroScreen({
          introPlaceholder,
          introMusic,
          introScreenHTML,
          game,
        });
      }
    }

    if (gameMode === "DIETRANSITION" || gameMode === "GAMEOVER") {
      // Clears all enemies and particles
      game.enemyWave.length !== 0 ? game.explodeAllEnemies() : null;
    }

    if (gameMode === "LEVELTRANSITION") {
      game.update(delta);
      if (context) game.render(context);
      game.levelTransition(delta);
    }

    if (
      gameMode === "PLAYING" ||
      gameMode === "DIETRANSITION" ||
      gameMode === "GAMEOVER"
    ) {
      if (!introMusic.paused) introMusic.pause();

      game.update(delta);
      if (context) game.render(context);
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});
