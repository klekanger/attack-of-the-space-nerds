import "@fortawesome/fontawesome-free/css/all.css";
import { Game } from "./classes/game";
import {
  hideAllElements,
  isAudioEnabled,
  isMobile,
  showAllElements,
} from "./lib/util";
import { GameMode } from "./types";

// eslint-disable-next-line import/no-unresolved
import startScreenMusic from "/audio/Raining Bits.ogg";

const FA_AUDIO_OFF = `<i class="fa-solid fa-volume-xmark"></i>`;
const FA_AUDIO_ON = `<i class="fa-solid fa-volume-high"></i>`;

window.addEventListener("load", function () {
  // If mobile device, replace button text with "Tap to Play"
  const playButton = document.getElementById("btn-play") as HTMLButtonElement;
  isMobile()
    ? (playButton.innerText = "Tap to Play")
    : (playButton.innerText = "Space to Play");

  // Select elements to hide during game play
  const htmlToHideDuringPlay: NodeListOf<HTMLElement> =
    document.querySelectorAll(".hide-during-play");

  // Set up audio and get audio toggle button element from DOM
  const introMusic = new Audio();
  introMusic.src = startScreenMusic;
  introMusic.loop = true;

  const audioToggleButton = document.getElementById(
    "speaker-symbol"
  ) as HTMLElement;
  audioToggleButton.innerHTML = FA_AUDIO_OFF;

  // Check if audio is enabled in localStorage
  if (isAudioEnabled()) {
    introMusic.play();
    audioToggleButton.innerHTML = FA_AUDIO_ON;
  }

  // Add event listener to audio toggle button
  audioToggleButton.addEventListener("click", () => {
    if (audioToggleButton.innerHTML === FA_AUDIO_OFF) {
      audioToggleButton.innerHTML = FA_AUDIO_ON;
      localStorage.setItem("space_nerds_audio", "on");
      introMusic.play();
    } else {
      audioToggleButton.innerHTML = FA_AUDIO_OFF;
      localStorage.setItem("space_nerds_audio", "off");
      introMusic.pause();
    }
  });

  // Set up main game canvas
  const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 900;

  // Create game instance
  // Almost all game logic is contained in the Game class
  const game = new Game(canvas, context);

  playButton.addEventListener("click", () => {
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

    if (gameMode === "IDLE" && context) {
      game.splashScreen.update(delta);
      game.splashScreen.draw(context);

      if (introMusic.paused && isAudioEnabled()) {
        introMusic.play();
      }

      if (!isStartTextVisible) {
        showAllElements(htmlToHideDuringPlay);
        isStartTextVisible = true;
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

      if (isStartTextVisible) {
        hideAllElements(htmlToHideDuringPlay);
        isStartTextVisible = false;
      }
    }

    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
});
