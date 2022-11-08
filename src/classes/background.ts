import { Game } from './game';
import { Layer } from './layer';

export class Background {
  game: Game;
  layer1: Layer;
  layer2: Layer;
  image1: HTMLImageElement;
  image2: HTMLImageElement;
  layers: Layer[];

  constructor(game: Game) {
    this.game = game;
    this.image2 = document.getElementById('layer2') as HTMLImageElement;
    this.image1 = document.getElementById('layer1') as HTMLImageElement;
    this.layer1 = new Layer(this.game, this.image1, 0.2);
    this.layer2 = new Layer(this.game, this.image2, 0.25);
    this.layers = [this.layer1, this.layer2];

    console.log(this.layers);
  }

  update() {
    this.layers.forEach((layer) => layer.update());
  }

  /* draw(context: CanvasRenderingContext2D) {
     this.layers.forEach((layer) => layer.draw(context));
  } */
}
