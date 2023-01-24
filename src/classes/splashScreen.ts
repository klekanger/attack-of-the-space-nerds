export class SplashScreen {
  width: number;
  height: number;
  zoom: number;
  zoomDirection: number;
  splashImage: HTMLImageElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.zoom = 1.0;
    this.zoomDirection = 0.0001;
    this.splashImage = new Image();
  }

  update() {
    // Zoom slowly in and out
    this.zoom += this.zoomDirection;

    if (this.zoom >= 1.1 || this.zoom <= 0.9) {
      this.zoomDirection *= -1;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.width, this.height);

    context.drawImage(
      this.splashImage,
      this.width / 2 - (this.width * this.zoom) / 2,
      this.height / 2 - (this.height * this.zoom) / 2,
      this.width * this.zoom,
      this.height * this.zoom
    );
  }
}
