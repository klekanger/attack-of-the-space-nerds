import { Game } from "./classes/game";
import { isMobile } from "./lib/util";
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

  if (game.getAudioEnabled() === true) {
    introMusic.play();
    audioToggleButton.innerHTML = FA_AUDIO_ON;
  }

  // Add event listener to audio toggle button
  audioToggleButton.addEventListener("click", () => {
    if (audioToggleButton.innerHTML === FA_AUDIO_OFF) {
      audioToggleButton.innerHTML = FA_AUDIO_ON;
      game.setAudioEnabled(true);
      introMusic.play();
    } else {
      audioToggleButton.innerHTML = FA_AUDIO_OFF;
      game.setAudioEnabled(false);
      introMusic.pause();
    }
  });

  playButton.onclick = () => {
    game.setGameMode(GameMode.PLAYING);
    introPlaceholder.innerHTML = "";
  };
}
