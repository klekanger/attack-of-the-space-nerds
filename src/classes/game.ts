import splashImage from "../artwork/attack-of-the-space-nerds-splash-screen.webp";
import { GameMode, IGame } from "../types";
import { Background } from "./background";
import { BigEars, Enemy, EnemyBomb, ScaryGeek } from "./enemy";
import { InputHandler } from "./inputHandler";
import { Particle } from "./particle";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { SplashScreen } from "./splashScreen";
import { UI } from "./ui";

import { randomBetween } from "../lib/util";

const NUM_OF_ENEMY_WAVES = 5;
const SECONDS_BEFORE_IDLE = 20 * 1000;
const SECONDS_DIE_TRANSITION = 2 * 1000;
const GAMESPEED_INCREASE = 0.002;

export class Game implements IGame {
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
  enemyWaveCounter: number;
  particles: Particle[];
  enemyTimer: number;
  gameSpeed: number;
  score: number;
  debug: boolean;
  lives: number;
  level: number;
  gameTime: number;
  levelTransitionTimer: number;
  levelTransitionReset: number;
  fps: number;
  audioEnabled: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ) {
    this.gameMode = GameMode.INTRO;

    this.canvas = canvas;
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;

    this.background = new Background(this);
    this.splashScreen = new SplashScreen(this);
    this.splashScreen.setSplashScreenImage(splashImage);
    this.ui = new UI(this);

    this.player = new Player(this);
    this.inputHandler = new InputHandler(this);

    this.keys = [];
    this.enemyWave = [];
    this.enemyWaveCounter = NUM_OF_ENEMY_WAVES;
    this.particles = [];
    this.debug = false;
    this.enemyTimer = 0;
    this.gameSpeed = 0.01;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameTime = 0;
    this.levelTransitionTimer = 2000;
    this.levelTransitionReset = this.levelTransitionTimer;
    this.fps = 0;
    this.audioEnabled = true;
  }

  update(delta: number) {
    this.background.update(delta);
    this.player.update(delta);

    // Run update method on all particles, and remove those we don't need anymore
    this.particles.forEach((particle) => particle.update());
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );

    // Add enemies to the game and detect collisions
    if (this.enemyWave.length === 0 && this.gameMode === "PLAYING") {
      if (this.enemyWaveCounter > 0) {
        this.addEnemyWave();
        this.enemyWaveCounter--;
      } else {
        this.level++;
        this.enemyWaveCounter = NUM_OF_ENEMY_WAVES;
        this.gameSpeed += GAMESPEED_INCREASE;

        // set gameMode to level transition for 2 seconds
        // and then back to playing
        this.setGameMode(GameMode.LEVELTRANSITION);
        setTimeout(() => {
          this.setGameMode(GameMode.PLAYING);
        }, 2000);
      }
    }

    this.enemyWave.forEach((enemy) => {
      enemy.update(delta);

      if (this.detectCollision(this.player, enemy)) {
        this.createParticles(250, enemy); // Player collided with enemy
        this.explodePlayer();
        this.lives--;
        this.enemyWaveCounter += 1;

        if (this.lives < 1) {
          this.lives = 0;
          this.setGameMode(GameMode.GAMEOVER);

          setTimeout(() => {
            console.log("setting game mode to idle");
            this.setGameMode(GameMode.IDLE);
          }, SECONDS_BEFORE_IDLE);
        } else {
          // set the game mode to die transition for 2 seconds
          // and then back to playing
          this.setGameMode(GameMode.DIETRANSITION);

          setTimeout(() => {
            this.setGameMode(GameMode.PLAYING);
          }, SECONDS_DIE_TRANSITION);
        }

        enemy.markedForDeletion = true;
      }

      // Detect projectile hits vs enemies
      this.player.projectiles.forEach((projectile) => {
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
      });

      if (enemy.canShoot) {
        if (enemy.shootTimer > 0) {
          enemy.shootTimer -= delta;
        } else {
          enemy.shootTimer = enemy.shootInterval;
          this.enemyShoot(enemy);
        }
      }
    });

    // Remove enemies that have been killed
    this.enemyWave = this.enemyWave.filter((enemy) => !enemy.markedForDeletion);
  }

  // Draw background, player, enemies, particles, etc.
  render(context: CanvasRenderingContext2D) {
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

  addEnemyWave() {
    const enemyCount = Math.floor(randomBetween(1, this.level + 5)); // random number of enemies

    for (let i = 0; i < enemyCount; i++) {
      // random number of ScaryGFeek and BigEars enemies
      if (Math.random() * 100 > 50) this.enemyWave.push(new ScaryGeek(this));
      else this.enemyWave.push(new BigEars(this));
    }
  }

  enemyShoot(enemy: Enemy) {
    this.enemyWave.push(
      new EnemyBomb(this, enemy.x, enemy.y + enemy.height / 2)
    );
  }

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

  detectCollision(rect1: Player | Projectile, rect2: Enemy): boolean {
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
      this.createParticles(250, enemy);
    });
  }

  explodePlayer() {
    this.createParticles(250, this.player);
    this.player.canShoot = false;
    if (this.getAudioEnabled() === true) this.player.sfxPlayerExplosion.play();

    // Move the player off screen
    this.player.x = -100;
    this.player.y = -100;

    // move the player back to the center of the screen after 2 seconds
    setTimeout(() => {
      this.player.x = this.width / 2 - this.player.width / 2;
      this.player.y = this.height - this.player.height - 10;

      this.player.canShoot = true;
    }, 2000);
  }

  // Show the level transition text
  levelTransition(delta: number) {
    if (!this.context) return;

    this.levelTransitionTimer -= delta;

    const alpha = this.levelTransitionTimer / 2000;
    const yPos = this.height - (this.levelTransitionTimer / 2000) * this.height;

    if (this.levelTransitionTimer > 0) {
      this.context.save();

      this.context.fillStyle = `rgba(215 171 65 / ${alpha})`;
      this.context.font = "60px 'Press Start 2P'";
      this.context.textAlign = "center";
      this.context.fillText(`Level ${this.level}`, this.width / 2, yPos);

      this.context.restore();
    } else {
      this.levelTransitionTimer = this.levelTransitionReset;
    }
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }

  setGameMode(newMode: GameMode) {
    console.log(`Current game mode: ${this.gameMode} – changing to ${newMode}`);
    this.gameMode = newMode;
  }

  getAudioEnabled(): boolean {
    return this.audioEnabled;
  }

  setAudioEnabled(newAudioEnabled: boolean) {
    this.audioEnabled = newAudioEnabled;
  }
}
