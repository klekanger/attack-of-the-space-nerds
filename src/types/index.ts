export enum GameMode {
  INTRO = "INTRO",
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  DIETRANSITION = "DIETRANSITION",
  LEVELTRANSITION = "LEVELTRANSITION",
  GAMEOVER = "GAMEOVER",
}

export interface ISetupIntroScreen {
  introPlaceholder: HTMLElement;
  introMusic: HTMLAudioElement;
  introScreenHTML: string;
  game: IGame;
}

export interface IBackground {
  game: IGame;
  layer1: ILayer;
  layer2: ILayer;
  image1: HTMLImageElement;
  image2: HTMLImageElement;
  layers: ILayer[];

  update(delta: number): void;
}

export interface ILayer {
  game: IGame;
  image: HTMLImageElement;
  speed: number;
  width: number;
  height: number;
  x: number;
  y: number;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export interface ISplashScreen {
  game: IGame;
  context: CanvasRenderingContext2D | null;
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

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  setSplashScreenImage(image: string): void;
  hasPressInsideTextBoundingBox(): boolean;
}

export interface IPlayer {
  game: IGame;
  width: number;
  height: number;
  xOffset: number;
  x: number;
  y: number;
  speedX: number;
  maxSpeed: number;
  playerImages: HTMLImageElement[];
  imageToDraw: HTMLImageElement;
  projectiles: Required<IProjectile>[];
  shootTimer: number;
  canShoot: boolean;
  shotsPerSecond: number;
  sfxShoot: IShoot;
  sfxPlayerExplosion: IPlayerExplosion;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  shoot(): void;
}

export interface IProjectile {
  game: IGame;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: "up" | "down";
  selectDirection: {
    [key: string]: number;
  };
  markedForDeletion: boolean;
  image: HTMLImageElement;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export interface IParticle {
  game: IGame;
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
  markedForDeletion: boolean;
  color: string;
  colorPalette: { r: number; g: number; b: number }[];
  currentAlpha: number;

  update(): void;
  updateParticleModel(particle: IParticle): IParticle;
  colorVariation(
    color: { r: number; g: number; b: number },
    variation: number
  ): string;
  randomColor(): { r: number; g: number; b: number };
  draw(context: CanvasRenderingContext2D): void;
}

export interface IInputHandler {
  game: IGame;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;

  setKeyboardEventListeners(): void;
  setMouseEventListeners(): void;
  getMousePosition(
    event: MouseEvent,
    canvas: HTMLCanvasElement
  ): { x: number; y: number };
}

export interface IUI {
  game: IGame;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  playerImage: HTMLImageElement;

  draw(context: CanvasRenderingContext2D): void;
}

export interface IGame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  background: IBackground;
  splashScreen: ISplashScreen;
  player: IPlayer;
  inputHandler: IInputHandler;
  ui: IUI;
  keys: string[];
  enemyWave: IEnemy[];
  enemyWaveCounter: number;
  particles: IParticle[];
  enemyTimer: number;
  gameSpeed: number;
  score: number;
  lives: number;
  level: number;
  levelTransitionTimer: number;
  levelTransitionReset: number;
  fps: number;

  update(delta: number): void;
  render(context: CanvasRenderingContext2D): void;
  addEnemyWave(): void;
  enemyShoot(enemy: IEnemy): void;
  createParticles(particleCount: number, enemyToBlowUp: IEnemy | IPlayer): void;
  detectCollision(rect1: IPlayer | IProjectile, rect2: IEnemy): boolean;
  initGame(fullReset: boolean): void;
  explodeAllEnemies(): void;
  explodePlayer(): void;
  getGameMode: GameMode;
  setGameMode: GameMode;
  isAudioEnabled: boolean;
  setAudioEnabled: boolean;
  levelTransition(delta: number): void;
}

export interface IEnemy {
  game: IGame;
  markedForDeletion: boolean;
  image: HTMLImageElement;
  x: number;
  xStart: number;
  y: number;
  width: number;
  height: number;
  frame: number;
  maxFrame: number;
  speed: number;
  verticalSpeed: number;
  multisprite: boolean;
  lives: number;
  sfxHit: IHit;
  sfxExplosion: IExplosion1;
  hitDamage: number;
  canShoot: boolean;
  shootTimer: number;
  shootInterval: number;
  animationTimer: number;
  animationInterval: number;
  direction?: number;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  playHitSound(): void;
  playExplosionSound(): void;
}

// interfaces for all sfxtypes
export interface IShoot {
  play(): void;
}

export interface IHit {
  play(): void;
}

export interface IExplosion1 {
  play(): void;
}

export interface IPlayerExplosion {
  play(): void;
}

export interface IChaseMovement {
  playerX: number;
  playerY: number;
  enemyX: number;
  enemyY: number;
  speed: number;
  delta: number;
  xMultiply?: number;
  yMultiply?: number;
  direction?: number;
}

export interface IcalculateSineWave {
  yPosition: number;
  xStart: number;
  viewportWidth: number;
}
