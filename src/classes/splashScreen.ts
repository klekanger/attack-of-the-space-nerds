export class SplashScreen {
  width: number;
  height: number;
  zoom: number;
  zoomDirection: number;
  splashImage: HTMLImageElement;
  backgroundColor: string;
  textColor1: string;
  textColor2: string;
  textPressToPlay: string;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.zoom = 1.0;
    this.zoomDirection = 0.0002;
    this.splashImage = new Image();
    this.backgroundColor = 'rgba(0 0 0 / 0.7)';
    this.textColor1 = 'rgba(215 225 230 / 1)';
    this.textColor2 = 'rgba(2 103 69 / 1)';
    this.textPressToPlay = 'Space to start';
  }

  update() {
    // Zoom slowly in and out
    this.zoom += this.zoomDirection;

    if (this.zoom >= 1.1 || this.zoom <= 0.9) {
      this.zoomDirection *= -1;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.font = `50px 'Press Start 2P'`;

    const PressToPlayTextLength = context.measureText(
      this.textPressToPlay
    ).width;
    const PressToPlayTextHeight =
      context.measureText(this.textPressToPlay).fontBoundingBoxAscent -
      context.measureText(this.textPressToPlay).fontBoundingBoxDescent;

    context.clearRect(0, 0, this.width, this.height);

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
      this.width / 2 - PressToPlayTextLength / 2 - 20,
      this.height / 2 + 250,
      PressToPlayTextLength + 40,
      PressToPlayTextHeight + 40
    );
    context.fillStyle = this.textColor2;
    context.textAlign = 'center';
    context.fillText('Space to start', this.width / 2, this.height / 2 + 320);

    context.restore();
  }
}
