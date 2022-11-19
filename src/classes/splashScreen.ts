export class SplashScreen {
  width: number;
  height: number;
  splashImage: HTMLImageElement;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.splashImage = document.getElementById('splash') as HTMLImageElement;
  }

  update() {}

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.splashImage, 0, 0);
  }
}
