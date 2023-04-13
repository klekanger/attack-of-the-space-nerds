import "@fortawesome/fontawesome-free/css/all.css";
import { Game } from "./classes/game";
import { introScreenHTML } from "./html/intro";
import { preIntroScreenHTML } from "./html/pre-intro";

import { isAudioEnabled } from "./lib/util";
import { GameMode } from "./types";

import { setupIntroScreen } from "./setupIntroScreen";
import startScreenMusic from "/audio/Raining Bits.mp3";

export const FA_AUDIO_OFF = `<i class="fa-solid fa-volume-xmark"></i>`;
export const FA_AUDIO_ON = `<i class="fa-solid fa-volume-high"></i>`;

window.addEventListener("load", function () {
  // Set up main game canvas
  const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 900;

  // Create game instance
  // Almost all game logic is contained in the Game class
  const game = new Game(canvas, context);
  game.setGameMode(GameMode.INTRO); // Start on the pre-intro-screen so that the user can interact with the page to be able to start the music

  const introPlaceholder = document.getElementById("intro") as HTMLElement;
  introPlaceholder.innerHTML = preIntroScreenHTML;
  const readyButton = document.getElementById("btn-ready") as HTMLButtonElement;

  const introMusic = new Audio();
  introMusic.src = startScreenMusic;
  introMusic.loop = true;

  readyButton.addEventListener("click", () => {
    game.setGameMode(GameMode.IDLE);
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

      if (introMusic.paused && isAudioEnabled()) {
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
