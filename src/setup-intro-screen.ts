import { FA_AUDIO_OFF, FA_AUDIO_ON } from './html/speaker-symbols';
import { isMobile } from './lib/util';
import { GameMode, type ISetupIntroScreen } from './types';

/**
 * Sets up the intro screen HTML and music, passed in as arguments.
 *
 * @param {ISetupIntroScreen} options - An object containing the following properties:
 * @param {HTMLElement} options.introPlaceholder - The HTML element where the intro screen will be displayed.
 * @param {HTMLAudioElement} options.introMusic - The audio element for the intro music.
 * @param {string} options.introScreenHtml - The HTML string for the intro screen.
 * @param {Game} options.game - The game instance.
 *
 * @returns {void}
 */
export function setupIntroScreen({
  introPlaceholder,
  introMusic,
  introScreenHtml,
  game,
}: ISetupIntroScreen): void {
  introPlaceholder.innerHTML = introScreenHtml;
  const container: HTMLElement = document.querySelector('#container')!;

  if (container) {
    container.style.width = `${game.canvas.clientWidth}px`;
    container.style.height = `${game.canvas.clientHeight}px`;
  }

  const playButton: HTMLButtonElement = document.querySelector('#btn-play')!;

  playButton.textContent = isMobile() ? 'Tap to Play' : 'Click to Play';

  const audioToggleButton: HTMLButtonElement =
    document.querySelector('#speaker-symbol')!;
  audioToggleButton.innerHTML = FA_AUDIO_OFF;

  if (game.audioEnabled) {
    void introMusic.play();
    audioToggleButton.innerHTML = FA_AUDIO_ON;
  }

  // Add event listener to audio toggle button
  audioToggleButton.addEventListener('click', () => {
    if (audioToggleButton.innerHTML === FA_AUDIO_OFF) {
      audioToggleButton.innerHTML = FA_AUDIO_ON;
      game.audioEnabled = true;
      void introMusic.play();
    } else {
      audioToggleButton.innerHTML = FA_AUDIO_OFF;
      game.audioEnabled = false;
      introMusic.pause();
    }
  });

  playButton.addEventListener('click', () => {
    introPlaceholder.innerHTML = '';
    game.gameMode = GameMode.PLAYING;
  });
}
