import { GameMode } from '../types';
import { Background } from './background';
import { SplashScreen } from './splashScreen';
import splashImage from '../artwork/attack-of-the-space-nerds-splash-screen.webp';
import { UI } from './ui';
import { Player } from './player';
import { InputHandler } from './inputHandler';
import { Enemy, ScaryGeek, EnemyBomb, BigEars } from './enemy';
import { Projectile } from './projectile';
import { Particle } from './particle';

import { randomBetween } from '../lib/util';

export class Game {
  private gameMode: GameMode;
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

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ) {
    this.gameMode = GameMode.IDLE;
    this.canvas = canvas;
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.splashScreen = new SplashScreen(this);
    this.player = new Player(this);
    this.inputHandler = new InputHandler(this);
    this.ui = new UI(this);
    this.keys = [];
    this.enemyWave = [];
    this.particles = [];
    this.debug = false;
    this.enemyTimer = 0;
    this.enemyInterval = 2000;
    this.speed = 0.3;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameTime = 0;
    this.fps = 0;

    this.splashScreen.setSplashScreenImage(splashImage);
  }

  update(delta: number) {
    this.background.update(delta);
    this.background.layer1.update(delta);
    this.background.layer2.update(delta);
    this.player.update(delta);

    // Run update method on all particles, and remove those we don't need anymore
    this.particles.forEach((particle) => particle.update());
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );

    // Add enemies to the game and detect collisions
    if (this.enemyWave.length === 0 && this.gameMode === 'PLAYING')
      this.#addEnemyWave();

    this.enemyWave.forEach((enemy) => {
      enemy.update(delta);

      if (this.#detectCollision(this.player, enemy)) {
        this.#createParticles(250, enemy); // Player collided with enemy
        this.explodePlayer();
        this.lives--;

        if (this.lives < 1) {
          this.lives = 0;
          this.setGameMode(GameMode.GAMEOVER);
          this.player.sfxPlayerExplosion.play();

          setTimeout(() => {
            this.setGameMode(GameMode.IDLE);
          }, 20000);
        } else {
          // set the game mode to die transition for 2 seconds
          // and then back to playing
          this.setGameMode(GameMode.DIETRANSITION);

          setTimeout(() => {
            this.setGameMode(GameMode.PLAYING);
          }, 2000);
        }

        enemy.markedForDeletion = true;
      }

      // Detect projectile hits vs enemies
      this.player.projectiles.forEach((projectile) => {
        if (this.#detectCollision(projectile, enemy)) {
          enemy.playHitSound();
          this.#createParticles(enemy.lives * 10, enemy); // Projectile collided with enemy

          this.score += enemy.lives;
          enemy.lives--;

          if (enemy.lives < 1) {
            enemy.markedForDeletion = true;
            enemy.playExplosionSound();
          }
          projectile.markedForDeletion = true;
        }
      });

      // Make the enemies shoot
      if (Math.random() * 1000 > 995 && enemy.canShoot) this.#enemyShoot(enemy);
    });

    // Remove enemies that have been killed
    this.enemyWave = this.enemyWave.filter((enemy) => !enemy.markedForDeletion);
  }

  // Draw background, player, enemies, particles, etc.
  draw(context: CanvasRenderingContext2D) {
    this.background.layer1.draw(context); // background stars and galaxies
    context.save();
    context.globalAlpha = 0.4;
    this.background.layer2.draw(context); // foreground star field
    context.restore();

    this.player.draw(context);
    this.particles.forEach((particle) => particle.draw(context));

    // Draw the bombs before the other enemies, so that the bombs appear underneath the enemies
    this.enemyWave.forEach((enemy) => {
      if (!enemy.canShoot) enemy.draw(context);
    });
    this.enemyWave.forEach((enemy) => {
      if (enemy.canShoot) enemy.draw(context);
    });

    // Draw score, lives, etc.
    this.ui.draw(context);
  }

  #addEnemyWave() {
    const enemyCount = randomBetween(1, this.level * 5); // random number of enemies
    for (let i = 0; i < enemyCount; i++) {
      // random number of ScaryGFeek and BigEars enemies
      if (Math.random() * 100 > 50) this.enemyWave.push(new ScaryGeek(this));
      else this.enemyWave.push(new BigEars(this));
    }
  }

  #enemyShoot(enemy: Enemy) {
    this.enemyWave.push(new EnemyBomb(this, enemy.x, enemy.y));
  }

  #createParticles(particleCount: number, enemyToBlowUp: Enemy | Player) {
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(
        new Particle(
          this,
          enemyToBlowUp.x + enemyToBlowUp.width * 0.5,
          enemyToBlowUp.y + enemyToBlowUp.height * 0.5
        )
      );
    }
  }

  #detectCollision(rect1: Player | Projectile, rect2: Enemy): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }

  initGame(fullReset = false) {
    if (fullReset) {
      this.score = 0;
      this.lives = 3;
      this.level = 1;
      this.setGameMode(GameMode.PLAYING);
    }

    this.enemyWave = [];
    this.particles = [];
    this.player.x = this.width / 2 - this.player.width / 2;
    this.player.y = this.height - this.player.height - 10;
    this.player.projectiles = [];
  }

  explodeAllEnemies() {
    this.enemyWave.forEach((enemy) => {
      enemy.markedForDeletion = true;
      this.#createParticles(250, enemy);
    });
  }

  explodePlayer() {
    this.#createParticles(250, this.player);

    // Make the player flash fast for 2 seconds
    this.player.flash = true;
    setTimeout(() => {
      this.player.flash = false;
    }, 2000);
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }

  setGameMode(newMode: GameMode) {
    this.gameMode = newMode;
  }
}
