import { Background } from './background';
import { UI } from './ui';
import { Player } from './player';
import { InputHandler } from './inputHandler';

export class Game {
  width: number;
  height: number;
  background: Background;
  player: Player;
  inputHandler: InputHandler;
  ui: UI;
  keys: string[];
  speed: number;
  ammo: number;
  maxAmmo: number;
  ammoTimer: number;
  ammoInterval: number;
  gameOver: boolean;
  score: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.background = new Background(this);
    this.player = new Player(this);
    this.inputHandler = new InputHandler(this);
    this.ui = new UI(this);
    this.keys = [];
    this.speed = 10;
    this.ammo = 20;
    this.maxAmmo = 50;
    this.ammoTimer = 0;
    this.ammoInterval = 350;
    this.gameOver = false;
    this.score = 0;
  }

  update(delta: number) {
    this.background.update();
    this.background.layer1.update();
    this.background.layer2.update();
    this.player.update(delta);
  }

  draw(context: CanvasRenderingContext2D) {
    this.background.layer1.draw(context); // background stars and galaxies
    context.save();
    context.globalAlpha = 0.4;
    this.background.layer2.draw(context); // foreground star field
    context.restore();

    this.ui.draw(context);

    this.player.draw(context);
  }
}
