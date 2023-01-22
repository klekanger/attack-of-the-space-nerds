export class SplashScreen {
  width: number;
  height: number;
  splashImage: HTMLImageElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.splashImage = new Image();
  }

  update() {}

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.splashImage, 0, 0, this.width, this.height);
  }
}
