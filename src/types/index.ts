export enum GameMode {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  DIETRANSITION = "DIETRANSITION",
  LEVELTRANSITION = "LEVELTRANSITION",
  GAMEOVER = "GAMEOVER",
}

export interface IGame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  background: Background;
  splashScreen: SplashScreen;
  player: Player;
  inputHandler: InputHandler;
  ui: UI;
  keys: string[];
  enemyWave: Enemy[];
  particles: Particle[];
  enemyTimer: number;
  enemyInterval: number;
  speed: number;
  score: number;
  debug: boolean;
  lives: number;
  level: number;
  gameTime: number;
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
  getGameMode(): GameMode;
  setGameMode(newMode: GameMode): void;
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
  animationTimer: number;
  animationInterval: number;
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
