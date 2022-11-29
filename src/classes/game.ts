import { Background } from './background';
import { UI } from './ui';
import { Player } from './player';
import { InputHandler } from './inputHandler';
import { Enemy, ScaryGeek, EnemyBomb } from './enemy';
import { Projectile } from './projectile';
import { randomBetween } from '../lib/util';

export class Game {
  gameMode: 'idle' | 'playing';
  width: number;
  height: number;
  background: Background;
  player: Player;
  inputHandler: InputHandler;
  ui: UI;
  keys: string[];
  enemyWave: Enemy[];
  enemyTimer: number;
  enemyInterval: number;
  speed: number;
  gameOver: boolean;
  score: number;
  debug: boolean;
  lives: number;
  level: number;
  gameTime: number;
  fps: number;

  constructor(width: number, height: number) {
    this.gameMode = 'playing';
    this.width = width;
    this.height = height;
    this.background = new Background(this);
    this.player = new Player(this);
    this.inputHandler = new InputHandler(this);
    this.ui = new UI(this);
    this.keys = [];
    this.enemyWave = [];
    this.debug = false;
    this.enemyTimer = 0;
    this.enemyInterval = 2000;
    this.speed = 10;
    this.gameOver = false;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameTime = 0;
    this.fps = 0;
  }

  update(delta: number) {
    if (this.debug) this.fps = 1 / delta;

    if (!this.gameOver) {
      this.gameTime += delta;
    } else {
      this.gameTime = 0;
    }

    this.background.update();
    this.background.layer1.update();
    this.background.layer2.update();
    this.player.update(delta);

    // Add enemies to the game and detect collisions
    if (this.enemyWave.length === 0) this.#addEnemyWave();

    this.enemyWave.forEach((enemy) => {
      enemy.update(delta);
      if (this.#detectCollision(this.player, enemy)) {
        enemy.markedForDeletion = true;
        this.lives--;

        if (this.lives < 1) {
          this.lives = 0;
          this.gameOver = true;
          this.player.sfxPlayerExplosion.play();
        }
      }

      // Detect projectile hits vs enemies
      this.player.projectiles.forEach((projectile) => {
        if (this.#detectCollision(projectile, enemy)) {
          enemy.playHitSound();
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

  draw(context: CanvasRenderingContext2D) {
    this.background.layer1.draw(context); // background stars and galaxies
    context.save();
    context.globalAlpha = 0.4;
    this.background.layer2.draw(context); // foreground star field
    context.restore();

    this.player.draw(context);

    this.enemyWave.forEach((enemy) => {
      enemy.draw(context);
    });

    this.ui.draw(context);
  }

  #addEnemyWave() {
    const enemyCount = randomBetween(1, this.level * 5); // random number of enemies

    for (let i = 0; i < enemyCount; i++) {
      this.enemyWave.push(new ScaryGeek(this));
    }
  }

  #enemyShoot(enemy: Enemy) {
    this.enemyWave.push(new EnemyBomb(this, enemy.x, enemy.y));
  }

  #detectCollision(rect1: Player | Projectile, rect2: Enemy): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }
}
