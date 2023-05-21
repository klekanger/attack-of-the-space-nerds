import { GameMode, IGame, IInputHandler } from "../types";

export class InputHandler implements IInputHandler {
  game: IGame;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;

  constructor(game: IGame) {
    this.game = game;
    this.canvas = document.getElementById("canvas1") as HTMLCanvasElement;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;

    this.setKeyboardEventListeners();
    this.setMouseEventListeners();
  }

  // Add keyboard event listeners
  setKeyboardEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "p" && this.game.getGameMode() !== GameMode.PLAYING) {
        // Resets game and changes game mode to PLAYING
        this.game.initGame(true);
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      } else if (e.key === " " && this.game.keys.indexOf(e.key) === -1) {
        this.game.keys.push(e.key);
      } else if (e.key === "d") {
        this.game.debug = !this.game.debug;
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
