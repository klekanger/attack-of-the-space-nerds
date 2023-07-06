import { GameMode, type IGame, type IInputHandler } from '../types';

export class InputHandler implements IInputHandler {
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  intervalId: number | undefined;
  previousMouseX: number;

  constructor(private readonly game: IGame) {
    this.canvas = document.querySelector('#canvas1')!;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.intervalId = undefined;
    this.previousMouseX = 0;

    this.setKeyboardEventListeners();
    this.setMouseEventListeners();
    this.setTouchEventListeners();
  }

  // Add touch event listeners
  setTouchEventListeners() {
    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();

      const { x } = this.getMousePosition(event.touches[0], this.canvas);

      if (x < this.game.player.x) {
        this.game.keys = ['ArrowLeft', ' '];
      } else if (x > this.game.player.x) {
        this.game.keys = ['ArrowRight', ' '];
      }
    });

    this.canvas.addEventListener('touchend', (event) => {
      event.preventDefault();

      this.game.keys = [];
    });

    this.canvas.addEventListener('touchcancel', (event) => {
      event.preventDefault();

      this.isMouseDown = false;
    });
  }

  // Add keyboard event listeners
  setKeyboardEventListeners() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'p' && this.game.gameMode !== GameMode.PLAYING) {
        // Resets game and changes game mode to PLAYING
        this.game.initGame(true);
      } else if (
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
        !this.game.keys.includes(event.key)
      ) {
        this.game.keys.push(event.key);
      } else if (event.key === ' ' && !this.game.keys.includes(event.key)) {
        this.game.keys.push(event.key);
      }
    });

    window.addEventListener('keyup', (event) => {
      if (this.game.keys.includes(event.key)) {
        this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
      }
    });
  }

  // Add event listener for mouse movements on canvas
  setMouseEventListeners() {
    this.canvas.addEventListener('mousemove', (event) => {
      const { x, y } = this.getMousePosition(event, this.canvas);
      this.mouseX = x;
      this.mouseY = y;
    });

    // Set this.clicked to true when mouse button is pressed
    this.canvas.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    // Set this.clicked to false when mouse button is released
    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  getMousePosition(event: MouseEvent | TouchInit, canvas: HTMLCanvasElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const x = ((event.clientX || 0) - canvasRect.left) * scaleX;
    const y = ((event.clientY || 0) - canvasRect.top) * scaleY;

    return { x, y };
  }
}
