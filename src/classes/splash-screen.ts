import { GameMode, type IGame, type ISplashScreen } from '../types';

export class SplashScreen implements ISplashScreen {
  context: CanvasRenderingContext2D | undefined;
  width: number;
  height: number;
  zoom: number;
  zoomDirection: number;
  splashImage: HTMLImageElement;
  backgroundColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
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

  constructor(private readonly game: IGame) {
    this.context = game.context;
    this.width = game.width;
    this.height = game.height;
    this.zoom = 1.1;
    this.zoomDirection = 0.000_01;
    this.splashImage = new Image();
    this.backgroundColor = 'rgba(0 0 0 / 0.7)';
    this.textColor1 = 'rgba(215 225 230 / 1)';
    this.textColor2 = 'rgba(95 131 127 / 1)';
    this.textColor3 = 'rgba(251 235 78 / 1)';
    this.textPressToPlay = 'Space to start';
    this.font = '50px "Press Start 2P"';
    if (this.context) this.context.font = this.font;
    this.pressToPlayTextLength = this.width;
    this.pressToPlayTextHeight = 50;
    this.textBoundingBox = {
      x: 0,
      y: this.height / 2 + 250,
      width: this.pressToPlayTextLength,
      height: this.pressToPlayTextHeight + 30,
    };
    this.highlightText = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.isHoveringPressToPlay = false;
  }

  update(delta: number) {
    this.zoom += this.zoomDirection * delta;

    if (this.zoom >= 1.5 || this.zoom <= 1) {
      this.zoomDirection *= -1;
    }

    // Double check that this.zoom is between 1 and 1.5
    if (this.zoom > 1.5) {
      this.zoom = 1.5;
    } else if (this.zoom < 1) {
      this.zoom = 1;
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
      this.game.gameMode = GameMode.PLAYING;
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
