import { Game } from "./classes/game";
import { isAudioEnabled, isMobile } from "./lib/util";
import { FA_AUDIO_OFF, FA_AUDIO_ON } from "./main";
import { GameMode } from "./types";

export function setupIntroScreen({
  introPlaceholder,
  introMusic,
  game,
  introScreenHTML,
}: {
  introPlaceholder: HTMLElement;
  introMusic: HTMLAudioElement;
  game: Game;
  introScreenHTML: string;
}) {
  introPlaceholder.innerHTML = introScreenHTML;
  const playButton = document.getElementById("btn-play") as HTMLButtonElement;

  isMobile()
    ? (playButton.innerText = "Tap to Play")
    : (playButton.innerText = "Space to Play");

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

  playButton.addEventListener("click", () => {
    game.setGameMode(GameMode.PLAYING);
    introPlaceholder.innerHTML = "";
  });
}
