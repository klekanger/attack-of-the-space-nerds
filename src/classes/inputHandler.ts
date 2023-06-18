import { GameMode, IGame, IInputHandler } from "../types";

export class InputHandler implements IInputHandler {
  game: IGame;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  intervalId: number | null;
  previousMouseX: number;

  constructor(game: IGame) {
    this.game = game;
    this.canvas = document.getElementById("canvas1") as HTMLCanvasElement;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.intervalId = null;
    this.previousMouseX = 0;

    this.setKeyboardEventListeners();
    this.setMouseEventListeners();
    this.setTouchEventListeners();
  }

  endTouch() {}

  // Add touch event listeners
  setTouchEventListeners() {
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();

      if (e.touches[0].clientX < this.game.player.x) {
        this.game.keys = ["ArrowLeft", " "];
      }
      if (e.touches[0].clientX > this.game.player.x) {
        this.game.keys = ["ArrowRight", " "];
      }
    });

    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.game.keys = [];
      this.endTouch();
    });

    this.canvas.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.endTouch();
      this.isMouseDown = false;
    });
  }

  // Add keyboard event listeners
  setKeyboardEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "p" && this.game.getGameMode !== GameMode.PLAYING) {
        // Resets game and changes game mode to PLAYING
        this.game.initGame(true);
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      } else if (e.key === " " && this.game.keys.indexOf(e.key) === -1) {
        this.game.keys.push(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.game.keys.indexOf(e.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      }
    });
  }

  // Add event listener for mouse movements on canvas
  setMouseEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const { x, y } = this.getMousePosition(e, this.canvas);
      this.mouseX = x;
      this.mouseY = y;
    });

    // set this.clicked to true when mouse button is pressed
    this.canvas.addEventListener("mousedown", () => {
      this.isMouseDown = true;
    });
    // set this.clicked to false when mouse button is released
    this.canvas.addEventListener("mouseup", () => {
      this.isMouseDown = false;
    });
  }

  getMousePosition(event: MouseEvent, canvas: HTMLCanvasElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const x = (event.clientX - canvasRect.left) * scaleX;
    const y = (event.clientY - canvasRect.top) * scaleY;

    return { x, y };
  }
}
