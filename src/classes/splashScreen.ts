import { GameMode } from '../types';
import { Game } from './game';

export class SplashScreen {
  game: Game;
  context: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  zoom: number;
  zoomDirection: number;
  splashImage: HTMLImageElement;
  backgroundColor: string;
  textColor1: string;
  textColor2: string;
  textPressToPlay: string;
  pressToPlayTextLength: number;
  pressToPlayTextHeight: number;
  textBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  font: string;
  highlightText: boolean;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  isHoveringPressToPlay: boolean;

  constructor(game: Game) {
    this.game = game;
    this.context = game.context;
    this.width = game.width;
    this.height = game.height;
    this.zoom = 1.0;
    this.zoomDirection = 0.0002;
    this.splashImage = new Image();
    this.backgroundColor = 'rgba(0 0 0 / 0.7)';
    this.textColor1 = 'rgba(215 225 230 / 1)';
    this.textColor2 = 'rgba(95 131 127 / 1)';
    this.textPressToPlay = 'Space to start';
    this.font = '50px "Press Start 2P"';
    if (this.context) this.context.font = this.font;
    this.pressToPlayTextLength =
      this.context?.measureText(this.textPressToPlay).width || 0;
    this.pressToPlayTextHeight =
      (this.context?.measureText(this.textPressToPlay).fontBoundingBoxAscent ||
        0) -
      (this.context?.measureText(this.textPressToPlay).fontBoundingBoxDescent ||
        0);

    this.textBoundingBox = {
      x: (this.width - this.pressToPlayTextLength - 40) / 2,
      y: this.height / 2 + 250,
      width: this.pressToPlayTextLength + 40,
      height: this.pressToPlayTextHeight + 40,
    };
    this.highlightText = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.isHoveringPressToPlay = false;
  }

  update() {
    // Zoom slowly in and out
    this.zoom += this.zoomDirection;

    if (this.zoom >= 1.5 || this.zoom <= 1.0) {
      this.zoomDirection *= -1;
    }

    this.mouseX = this.game.inputHandler.mouseX;
    this.mouseY = this.game.inputHandler.mouseY;

    // Check if cursor is inside textBoundingBox
    if (
      this.mouseX <= this.textBoundingBox.x + this.textBoundingBox.width &&
      this.mouseX >= this.textBoundingBox.x &&
      this.mouseY >= this.textBoundingBox.y &&
      this.mouseY <= this.textBoundingBox.y + this.textBoundingBox.height
    ) {
      this.isHoveringPressToPlay = true;
    } else {
      this.isHoveringPressToPlay = false;
    }

    if (this.hasPressInsideTextBoundingBox()) {
      this.game.setGameMode(GameMode.PLAYING);
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.clearRect(0, 0, this.width, this.height);
    context.font = this.font;

    // Draw the splash image
    context.drawImage(
      this.splashImage,
      this.width / 2 - (this.width * this.zoom) / 2,
      this.height / 2 - (this.height * this.zoom) / 2,
      this.width * this.zoom,
      this.height * this.zoom
    );

    // Draw the title text
    context.fillStyle = this.backgroundColor;
    context.fillRect(this.width / 2 - 350, this.height / 2 + 30, 700, 160);

    context.fillStyle = this.textColor1;
    context.textAlign = 'center';
    context.fillText('Attack of the', this.width / 2, this.height / 2 + 100);
    context.fillText('Space Nerds', this.width / 2, this.height / 2 + 170);

    // Draw a rectangle with the text "Press space to start"
    context.fillStyle = this.backgroundColor;
    context.fillRect(
      this.textBoundingBox.x,
      this.textBoundingBox.y,
      this.textBoundingBox.width,
      this.textBoundingBox.height
    );

    this.isHoveringPressToPlay
      ? (context.fillStyle = this.textColor2)
      : (context.fillStyle = this.textColor1);
    context.textAlign = 'center';
    context.fillText('Space to start', this.width / 2, this.height / 2 + 320);

    context.restore();
  }

  // Setter for splashscreen image
  setSplashScreenImage(image: string) {
    this.splashImage.src = image;
  }

  // Check if cursor is inside textBoundingBox
  hasPressInsideTextBoundingBox() {
    return this.game.inputHandler.isMouseDown && this.isHoveringPressToPlay;
  }
}
