import { isMobile } from "./lib/util";
import { FA_AUDIO_OFF, FA_AUDIO_ON } from "./main";
import { GameMode, ISetupIntroScreen } from "./types";

/**
 * Sets up the intro screen HTML and music, passed in as arguments.
 *
 * @param {ISetupIntroScreen} options - An object containing the following properties:
 * @param {HTMLElement} options.introPlaceholder - The HTML element where the intro screen will be displayed.
 * @param {HTMLAudioElement} options.introMusic - The audio element for the intro music.
 * @param {string} options.introScreenHTML - The HTML string for the intro screen.
 * @param {Game} options.game - The game instance.
 *
 * @returns {void}
 */
export function setupIntroScreen({
  introPlaceholder,
  introMusic,
  introScreenHTML,
  game,
}: ISetupIntroScreen): void {
  introPlaceholder.innerHTML = introScreenHTML;
  const container = document.getElementById("container") as HTMLElement;
  if (container) {
    container.style.width = `${game.canvas.clientWidth}px`;
    container.style.height = `${game.canvas.clientHeight}px`;
  }
  const playButton = document.getElementById("btn-play") as HTMLButtonElement;

  isMobile()
    ? (playButton.innerText = "Tap to Play")
    : (playButton.innerText = "Click to Play");

  const audioToggleButton = document.getElementById(
    "speaker-symbol"
  ) as HTMLElement;
  audioToggleButton.innerHTML = FA_AUDIO_OFF;

  if (game.isAudioEnabled === true) {
    introMusic.play();
    audioToggleButton.innerHTML = FA_AUDIO_ON;
  }

  // Add event listener to audio toggle button
  audioToggleButton.addEventListener("click", () => {
    if (audioToggleButton.innerHTML === FA_AUDIO_OFF) {
      audioToggleButton.innerHTML = FA_AUDIO_ON;
      game.setAudioEnabled = true;
      introMusic.play();
    } else {
      audioToggleButton.innerHTML = FA_AUDIO_OFF;
      game.setAudioEnabled = false;
      introMusic.pause();
    }
  });

  playButton.onclick = () => {
    introPlaceholder.innerHTML = "";
    game.setGameMode = GameMode.PLAYING;
  };
}
