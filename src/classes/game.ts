import splashImage from '../artwork/attack-of-the-space-nerds-splash-screen.webp';
import { randomBetween } from '../lib/util';
import { GameMode, type IGame } from '../types';
import { Background } from './background';
import { BigEars, EnemyBomb, ScaryGeek, type Enemy } from './enemy';
import { InputHandler } from './input-handler';
import { Particle } from './particle';
import { Player } from './player';
import { type Projectile } from './projectile';
import { SplashScreen } from './splash-screen';
import { Ui } from './ui';

const NUM_OF_ENEMY_WAVES = 5;
const SECONDS_BEFORE_IDLE = 20 * 1000;
const SECONDS_DIE_TRANSITION = 2 * 1000;
const GAMESPEED_INCREASE = 0.002;

export class Game implements IGame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | undefined;
  width: number;
  height: number;
  background: Background;
  splashScreen: SplashScreen;
  player: Player;
  inputHandler: InputHandler;
  ui: Ui;
  keys: string[];
  enemyWave: Enemy[];
  enemyWaveCounter: number;
  particles: Particle[];
  gameSpeed: number;
  score: number;
  lives: number;
  level: number;
  levelTransitionTimer: number;
  levelTransitionReset: number;
  fps: number;

  #gameMode: GameMode;
  #audioEnabled: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | undefined
  ) {
    this.canvas = canvas;
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.splashScreen = new SplashScreen(this);
    this.splashScreen.setSplashScreenImage = splashImage;
    this.ui = new Ui(this);
    this.player = new Player(this);
    this.inputHandler = new InputHandler(this);
    this.keys = [];
    this.enemyWave = [];
    this.enemyWaveCounter = NUM_OF_ENEMY_WAVES;
    this.particles = [];
    this.gameSpeed = 0.01;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.levelTransitionTimer = 2000;
    this.levelTransitionReset = this.levelTransitionTimer;
    this.fps = 0;

    this.#gameMode = GameMode.INTRO;
    this.#audioEnabled = true;
  }

  /**
   * Game update method.
   * All game logic goes here. Updates on every frame.
   * @param delta { number } - Time since last frame
   */
  update(delta: number) {
    this.background.update(delta);
    this.player.update(delta);

    // Run update method on all particles, and remove those we don't need anymore
    for (const particle of this.particles) {
      particle.update();
    }

    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );

    // Add enemies to the game and detect collisions
    if (this.enemyWave.length === 0 && this.#gameMode === 'PLAYING') {
      if (this.enemyWaveCounter > 0) {
        this.addEnemyWave();
        this.enemyWaveCounter--;
      } else {
        this.level++;
        this.enemyWaveCounter = NUM_OF_ENEMY_WAVES;
        this.gameSpeed += GAMESPEED_INCREASE;

        // Set gameMode to level transition for 2 seconds
        // and then back to playing
        this.gameMode = GameMode.LEVELTRANSITION;
        setTimeout(() => {
          this.gameMode = GameMode.PLAYING;
        }, 2000);
      }
    }

    for (const enemy of this.enemyWave) {
      enemy.update(delta);

      if (this.detectCollision(this.player, enemy)) {
        this.createParticles(250, enemy); // Player collided with enemy
        this.explodePlayer();
        this.lives--;
        this.enemyWaveCounter += 1;

        if (this.lives < 1) {
          this.lives = 0;
          this.gameMode = GameMode.GAMEOVER;

          setTimeout(() => {
            this.gameMode = GameMode.IDLE;
          }, SECONDS_BEFORE_IDLE);
        } else {
          // Not completely dead yet...
          // Set the game mode to die transition for ? seconds
          // and then back to playing
          this.gameMode = GameMode.DIETRANSITION;

          setTimeout(() => {
            this.gameMode = GameMode.PLAYING;
          }, SECONDS_DIE_TRANSITION);
        }

        enemy.markedForDeletion = true;
      }

      // Detect projectile hits vs enemies
      for (const projectile of this.player.projectiles) {
        if (this.detectCollision(projectile, enemy)) {
          enemy.playHitSound();
          this.createParticles(enemy.lives * 10, enemy); // Projectile collided with enemy

          this.score += enemy.lives;
          enemy.lives--;

          if (enemy.lives < 1) {
            enemy.markedForDeletion = true;
            enemy.playExplosionSound();
          }

          projectile.markedForDeletion = true;
        }
      }

      if (enemy.canShoot) {
        if (enemy.shootTimer > 0) {
          enemy.shootTimer -= delta;
        } else {
          enemy.shootTimer = enemy.shootInterval;
          this.enemyShoot(enemy);
        }
      }
    }

    // Remove enemies that have been killed
    this.enemyWave = this.enemyWave.filter((enemy) => !enemy.markedForDeletion);
  }

  /**
   * Game render method.
   * Draws background, player, enemies, particles, etc.
   * @param context { CanvasRenderingContext2D } - The canvas context
   */
  render(context: CanvasRenderingContext2D) {
    this.background.layer1.draw(context); // Background stars and galaxies
    context.save();
    context.globalAlpha = 0.4;
    this.background.layer2.draw(context); // Foreground star field
    context.restore();

    this.player.draw(context);

    for (const particle of this.particles) {
      particle.draw(context);
    }

    // Draw the bombs before the other enemies, so that the bombs appear underneath the enemies
    for (const enemy of this.enemyWave) {
      if (!enemy.canShoot) enemy.draw(context); // Bombs are the only ones that can't shoot. Draw them first.
    }

    for (const enemy of this.enemyWave) {
      if (enemy.canShoot) enemy.draw(context); // Then the enemies on top of the bombs
    }

    // Draw score, lives, etc.
    this.ui.draw(context);
  }

  /**
   * Adds a random number of enemies to the game.
   * The max number of enemies is based on the current level.
   */
  addEnemyWave() {
    const enemyCount = Math.floor(randomBetween(1, this.level + 5)); // Random number of enemies

    for (let i = 0; i < enemyCount; i++) {
      // Random number of ScaryGFeek and BigEars enemies
      if (Math.random() * 100 > 50) this.enemyWave.push(new ScaryGeek(this));
      else this.enemyWave.push(new BigEars(this));
    }
  }

  /**
   * Pushes a new EnemyBomb to the enemyWave array, at the position of the enemy that is shooting.
   *
   * @param enemy { Enemy } - The enemy that is shooting
   */
  enemyShoot(enemy: Enemy) {
    this.enemyWave.push(
      new EnemyBomb(this, enemy.x, enemy.y + enemy.height / 2)
    );
  }

  /**
   * Creates a nice explosion of particles when an enemy is hit.
   *
   * @param particleCount { number } - The number of particles to create
   * @param enemyToBlowUp { Enemy | Player } - The enemy or player to blow up
   */
  createParticles(particleCount: number, enemyToBlowUp: Enemy | Player) {
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

  /**
   * Detects collision between Player or Projectile and Enemy
   * by checking the bounding boxes of the two objects.
   *
   * @param rect1 { Player | Projectile } - The player or projectile
   * @param rect2 { Enemy } - The enemy
   * @returns { boolean } - True if collision detected, false otherwise
   */
  detectCollision(rect1: Player | Projectile, rect2: Enemy): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }

  /**
   * Game class. Method initializes the game.
   *
   * @param fullReset - If true, resets the game completely, including score, lives and level.If false, only resets the player and enemies.
   */
  initGame(fullReset = false) {
    if (fullReset) {
      this.score = 0;
      this.lives = 3;
      this.level = 1;
      this.gameMode = GameMode.PLAYING;
    }

    this.enemyWave = [];
    this.particles = [];
    this.player.x = this.width / 2 - this.player.width / 2;
    this.player.y = this.height - this.player.height - 10;
    this.player.projectiles = [];
  }

  explodeAllEnemies() {
    for (const enemy of this.enemyWave) {
      enemy.markedForDeletion = true;
      this.createParticles(250, enemy);
    }
  }

  explodePlayer() {
    this.createParticles(250, this.player);
    this.player.canShoot = false;
    if (this.audioEnabled) this.player.sfxPlayerExplosion.play();

    // Move the player off screen
    this.player.x = -100;
    this.player.y = -100;

    // Move the player back to the start position after 2 seconds
    setTimeout(() => {
      this.player.x = this.width / 2 - this.player.width / 2;
      this.player.y = this.height - this.player.height - 10;

      this.player.canShoot = true;
    }, 2000);
  }

  /**
   * Show the level transition text (Level 1, Level 2, etc.)
   *
   * @param delta { number } - Time since last frame
   */
  levelTransition(delta: number) {
    if (!this.context) return;

    this.levelTransitionTimer -= delta;

    const alpha = this.levelTransitionTimer / 2000;
    const yPos = this.height - (this.levelTransitionTimer / 2000) * this.height;

    if (this.levelTransitionTimer > 0) {
      this.context.save();

      this.context.fillStyle = `rgba(215 171 65 / ${alpha})`;
      this.context.font = "60px 'Press Start 2P'";
      this.context.textAlign = 'center';
      this.context.fillText(`Level ${this.level}`, this.width / 2, yPos);

      this.context.restore();
    } else {
      this.levelTransitionTimer = this.levelTransitionReset;
    }
  }

  get gameMode(): GameMode {
    return this.#gameMode;
  }

  set gameMode(newMode: GameMode) {
    this.#gameMode = newMode;
  }

  get audioEnabled(): boolean {
    return this.#audioEnabled;
  }

  set audioEnabled(newAudioEnabled: boolean) {
    this.#audioEnabled = newAudioEnabled;
  }
}
