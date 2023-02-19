import { Game } from './game';
import { Layer } from './layer';

import backgroundImageLayer2 from '../artwork/foreground-stars.webp';
import backgroundImageLayer1 from '../artwork/GalaxyUno.webp';

export class Background {
  game: Game;
  layer1: Layer;
  layer2: Layer;
  image1: HTMLImageElement;
  image2: HTMLImageElement;
  layers: Layer[];

  constructor(game: Game) {
    this.game = game;

    this.image1 = new Image();
    this.image1.src = backgroundImageLayer1;
    this.image2 = new Image();
    this.image2.src = backgroundImageLayer2;
    this.layer1 = new Layer(this.game, this.image1, 0.1);
    this.layer2 = new Layer(this.game, this.image2, 0.15);
    this.layers = [this.layer1, this.layer2];
  }

  update(delta: number) {
    this.layers.forEach((layer) => layer.update(delta));
  }
}
