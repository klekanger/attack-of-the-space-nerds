export enum GameMode {
  INTRO = 'INTRO',
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  DIETRANSITION = 'DIETRANSITION',
  LEVELTRANSITION = 'LEVELTRANSITION',
  GAMEOVER = 'GAMEOVER',
}

export type ISetupIntroScreen = {
  introPlaceholder: HTMLElement;
  introMusic: HTMLAudioElement;
  introScreenHtml: string;
  game: IGame;
};

export type IBackground = {
  layer1: ILayer;
  layer2: ILayer;
  image1: HTMLImageElement;
  image2: HTMLImageElement;
  layers: ILayer[];

  update(delta: number): void;
};

export type ILayer = {
  width: number;
  height: number;
  x: number;
  y: number;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
};

export type ISplashScreen = {
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

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  setSplashScreenImage(image: string): void;
  hasPressInsideTextBoundingBox(): boolean;
};

export type IPlayer = {
  width: number;
  height: number;
  xOffset: number;
  x: number;
  y: number;
  speedX: number;
  maxSpeed: number;
  playerImages: HTMLImageElement[];
  imageToDraw: HTMLImageElement;
  projectiles: Array<Required<IProjectile>>;
  shootTimer: number;
  canShoot: boolean;
  shotsPerSecond: number;
  sfxShoot: IShoot;
  sfxPlayerExplosion: IPlayerExplosion;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  shoot(): void;
};

export type IProjectile = {
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 'up' | 'down';
  selectDirection: Record<string, number>;
  markedForDeletion: boolean;
  image: HTMLImageElement;

  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
};

export type IParticle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
  markedForDeletion: boolean;
  color: string;
  colorPalette: Array<{ r: number; g: number; b: number }>;
  currentAlpha: number;

  update(): void;
  updateParticleModel(particle: IParticle): IParticle;
  colorVariation(
    color: { r: number; g: number; b: number },
    variation: number
  ): string;
  randomColor(): { r: number; g: number; b: number };
  draw(context: CanvasRenderingContext2D): void;
};

export type IInputHandler = {
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
};

export type IUi = {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  playerImage: HTMLImageElement;

  draw(context: CanvasRenderingContext2D): void;
};

export type IGame = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | undefined;
  width: number;
  height: number;

  background: IBackground;
  splashScreen: ISplashScreen;
  ui: IUi;

  player: IPlayer;
  inputHandler: IInputHandler;

  keys: string[];
  enemyWave: IEnemy[];
  enemyWaveCounter: number;
  particles: IParticle[];
  gameSpeed: number;
  score: number;
  lives: number;
  level: number;
  levelTransitionTimer: number;
  levelTransitionReset: number;
  fps: number;
  gameMode: GameMode;
  audioEnabled: boolean;
  update(delta: number): void;
  render(context: CanvasRenderingContext2D): void;
  addEnemyWave(): void;
  enemyShoot(enemy: IEnemy): void;
  createParticles(particleCount: number, enemyToBlowUp: IEnemy | IPlayer): void;
  detectCollision(rect1: IPlayer | IProjectile, rect2: IEnemy): boolean;
  initGame(fullReset: boolean): void;
  explodeAllEnemies(): void;
  explodePlayer(): void;
  levelTransition(delta: number): void;
};

export type IEnemy = {
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
};

// Interfaces for all sfxtypes
export type IShoot = {
  play(): void;
};

export type IHit = {
  play(): void;
};

export type IExplosion1 = {
  play(): void;
};

export type IPlayerExplosion = {
  play(): void;
};

export type IChaseMovement = {
  playerX: number;
  playerY: number;
  enemyX: number;
  enemyY: number;
  speed: number;
  delta: number;
  xMultiply?: number;
  yMultiply?: number;
  direction?: number;
};

export type IcalculateSineWave = {
  yPosition: number;
  xStart: number;
  viewportWidth: number;
};
