# Attack of the Space Nerds - API Documentation

This document provides comprehensive documentation for all public APIs, functions, and components in the Attack of the Space Nerds 2D space shooter game.

## Table of Contents

1. [Overview](#overview)
2. [Main Application](#main-application)
3. [Core Classes](#core-classes)
4. [Utility Functions](#utility-functions)
5. [Type Definitions](#type-definitions)
6. [Usage Examples](#usage-examples)

## Overview

Attack of the Space Nerds is a 2D space shooter game built with TypeScript, HTML5 Canvas, and vanilla JavaScript. The game features object-oriented design with classes for game entities, particle effects, input handling, and audio management.

### Architecture

- **Main Entry Point**: `src/main.ts` - Initializes the game and runs the main game loop
- **Core Game Logic**: `src/classes/game.ts` - The main Game class that orchestrates all game components
- **Game Entities**: Player, enemies, projectiles, and particles
- **Supporting Systems**: Input handling, UI, background rendering, and audio

## Main Application

### Game Initialization

#### `main.ts`

The main entry point that sets up the game canvas and starts the game loop.

**Key Functions:**

##### `gameLoop(timestamp: number)`

The main game animation loop that runs at 60 FPS using `requestAnimationFrame`.

```typescript
function gameLoop(timestamp: number): void
```

**Parameters:**
- `timestamp` (number) - Current timestamp from requestAnimationFrame

**Description:**
- Calculates delta time between frames
- Updates FPS counter
- Handles different game modes (INTRO, IDLE, PLAYING, etc.)
- Calls game update and draw methods
- Manages intro screen music

**Usage Example:**
```typescript
// Automatically called by requestAnimationFrame
requestAnimationFrame(gameLoop);
```

### Setup Functions

#### `setupIntroScreen(options: ISetupIntroScreen)`

Sets up the intro screen HTML and manages intro music.

```typescript
function setupIntroScreen({
  introPlaceholder: HTMLElement,
  introMusic: HTMLAudioElement,
  introScreenHtml: string,
  game: IGame
}): void
```

**Parameters:**
- `introPlaceholder` (HTMLElement) - Container element for intro screen
- `introMusic` (HTMLAudioElement) - Audio element for background music
- `introScreenHtml` (string) - HTML content for intro screen
- `game` (IGame) - Game instance

**Features:**
- Responsive design for mobile/desktop
- Audio toggle functionality
- Play button event handling

**Usage Example:**
```typescript
setupIntroScreen({
  introPlaceholder: document.querySelector('#intro'),
  introMusic: new Audio('intro-music.mp3'),
  introScreenHtml: '<div>Game Title</div>',
  game: gameInstance
});
```

## Core Classes

### Game Class

The main game class that orchestrates all game components and logic.

#### Constructor

```typescript
constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D)
```

**Parameters:**
- `canvas` (HTMLCanvasElement) - The game canvas element
- `context` (CanvasRenderingContext2D) - 2D rendering context

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Canvas width (960px) |
| `height` | number | Canvas height (1600px) |
| `score` | number | Current player score |
| `lives` | number | Player lives remaining |
| `level` | number | Current game level |
| `gameSpeed` | number | Global game speed multiplier |
| `fps` | number | Current frames per second |
| `gameMode` | GameMode | Current game state |
| `audioEnabled` | boolean | Audio on/off state |

#### Public Methods

##### `update(delta: number)`

Updates all game entities and handles game logic.

```typescript
update(delta: number): void
```

**Parameters:**
- `delta` (number) - Time elapsed since last frame in milliseconds

**Features:**
- Updates background, player, enemies, particles
- Handles collision detection
- Manages enemy wave spawning
- Processes game state transitions

##### `draw(context: CanvasRenderingContext2D)`

Renders all game entities to the canvas.

```typescript
draw(context: CanvasRenderingContext2D): void
```

**Parameters:**
- `context` (CanvasRenderingContext2D) - Canvas rendering context

**Rendering Order:**
1. Background layer 1 (galaxies/nebulae)
2. Background layer 2 (stars with transparency)
3. Player ship and projectiles
4. Particle effects
5. Enemy bombs (behind enemies)
6. Enemy ships
7. UI elements

##### `addEnemyWave()`

Spawns a new wave of enemies based on current level.

```typescript
addEnemyWave(): void
```

**Features:**
- Random enemy count based on level
- 50/50 split between ScaryGeek and BigEars enemies
- Difficulty scaling with level

##### `enemyShoot(enemy: Enemy)`

Creates an enemy projectile at the specified enemy's position.

```typescript
enemyShoot(enemy: Enemy): void
```

**Parameters:**
- `enemy` (Enemy) - The enemy instance that's shooting

##### `createParticles(particleCount: number, target: Enemy | Player)`

Creates explosion particle effects.

```typescript
createParticles(particleCount: number, target: Enemy | Player): void
```

**Parameters:**
- `particleCount` (number) - Number of particles to create
- `target` (Enemy | Player) - Object to create explosion at

##### `detectCollision(rect1: Player | Projectile, rect2: Enemy)`

Performs AABB collision detection between two rectangular objects.

```typescript
detectCollision(rect1: Player | Projectile, rect2: Enemy): boolean
```

**Parameters:**
- `rect1` (Player | Projectile) - First collision object
- `rect2` (Enemy) - Second collision object

**Returns:**
- `boolean` - True if collision detected

##### `initGame(fullReset: boolean)`

Initializes or resets the game state.

```typescript
initGame(fullReset: boolean = false): void
```

**Parameters:**
- `fullReset` (boolean) - If true, resets score, lives, and level

##### `levelTransition(delta: number)`

Displays level transition animation.

```typescript
levelTransition(delta: number): void
```

**Parameters:**
- `delta` (number) - Time since last frame

### Player Class

Represents the player's spaceship with movement, shooting, and rendering capabilities.

#### Constructor

```typescript
constructor(game: IGame)
```

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | Horizontal position |
| `y` | number | Vertical position |
| `width` | number | Player width (99px) |
| `height` | number | Player height (75px) |
| `speedX` | number | Current horizontal velocity |
| `maxSpeed` | number | Maximum movement speed |
| `projectiles` | PlayerProjectile[] | Array of player bullets |
| `canShoot` | boolean | Whether player can fire |
| `shotsPerSecond` | number | Fire rate (5 shots/second) |

#### Public Methods

##### `update(delta: number)`

Updates player position, handles input, and manages projectiles.

```typescript
update(delta: number): void
```

**Input Controls:**
- `ArrowLeft` or `a` - Move left
- `ArrowRight` or `d` - Move right
- `Space` - Shoot

**Features:**
- Boundary collision with screen edges
- Automatic sprite selection based on movement direction
- Projectile lifecycle management

##### `draw(context: CanvasRenderingContext2D)`

Renders the player ship and projectiles.

```typescript
draw(context: CanvasRenderingContext2D): void
```

##### `shoot()`

Creates a new projectile if shooting is enabled.

```typescript
shoot(): void
```

**Features:**
- Rate limiting (5 shots per second)
- Audio feedback (if enabled)
- Projectile positioning at ship center

### Enemy Classes

#### Base Enemy Class

Abstract base class for all enemy types.

```typescript
class Enemy implements IEnemy
```

##### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | Horizontal position |
| `y` | number | Vertical position |
| `width` | number | Enemy width |
| `height` | number | Enemy height |
| `lives` | number | Health points |
| `speed` | number | Movement speed |
| `canShoot` | boolean | Can fire projectiles |
| `markedForDeletion` | boolean | Should be removed |

##### Public Methods

##### `update(delta: number)`

Updates enemy position and animation.

```typescript
update(delta: number): void
```

##### `draw(context: CanvasRenderingContext2D)`

Renders the enemy sprite.

```typescript
draw(context: CanvasRenderingContext2D): void
```

##### `playHitSound()` / `playExplosionSound()`

Plays audio feedback for hits and destruction.

```typescript
playHitSound(): void
playExplosionSound(): void
```

#### ScaryGeek Enemy

Aggressive enemy that chases the player.

```typescript
class ScaryGeek extends Enemy
```

**Characteristics:**
- 3 lives
- Chase movement pattern with sine wave variation
- Can shoot projectiles
- 23-frame sprite animation

#### BigEars Enemy

Flying enemy with sine wave movement.

```typescript
class BigEars extends Enemy
```

**Characteristics:**
- 2 lives
- Sine wave horizontal movement
- Cannot shoot
- 23-frame sprite animation

#### EnemyBomb

Projectile fired by enemies.

```typescript
class EnemyBomb extends Enemy
```

**Characteristics:**
- 1 life
- Straight downward movement
- Cannot shoot
- Single sprite (no animation)

### Projectile Classes

#### Base Projectile Class

```typescript
class Projectile implements IProjectile
```

##### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | Horizontal position |
| `y` | number | Vertical position |
| `width` | number | Projectile width |
| `height` | number | Projectile height |
| `speed` | number | Movement speed |
| `direction` | 'up' \| 'down' | Movement direction |
| `markedForDeletion` | boolean | Should be removed |

##### Public Methods

##### `update(delta: number)`

Updates projectile position and checks boundaries.

```typescript
update(delta: number): void
```

##### `draw(context: CanvasRenderingContext2D)`

Renders the projectile sprite.

```typescript
draw(context: CanvasRenderingContext2D): void
```

#### PlayerProjectile

Player-fired projectile that moves upward.

```typescript
class PlayerProjectile extends Projectile
```

### Particle Class

Creates explosive particle effects for visual feedback.

```typescript
class Particle implements IParticle
```

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | Horizontal position |
| `y` | number | Vertical position |
| `radius` | number | Particle size |
| `speed` | number | Movement speed |
| `direction` | number | Movement angle (0-360°) |
| `color` | string | RGB color value |
| `currentAlpha` | number | Transparency (0-1) |
| `markedForDeletion` | boolean | Should be removed |

#### Public Methods

##### `update()`

Updates particle position and alpha transparency.

```typescript
update(): void
```

**Features:**
- Physics-based movement with angle calculation
- Automatic alpha decay for fade-out effect
- Boundary checking for cleanup

##### `draw(context: CanvasRenderingContext2D)`

Renders the particle as a colored circle.

```typescript
draw(context: CanvasRenderingContext2D): void
```

##### `colorVariation(color, variation)`

Generates color variants for visual diversity.

```typescript
colorVariation(
  color: {r: number, g: number, b: number}, 
  variation: number = 50
): string
```

### Input Handler Class

Manages keyboard, mouse, and touch input.

```typescript
class InputHandler implements IInputHandler
```

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `mouseX` | number | Mouse X coordinate |
| `mouseY` | number | Mouse Y coordinate |
| `isMouseDown` | boolean | Mouse button state |

#### Public Methods

##### `setKeyboardEventListeners()`

Initializes keyboard input handling.

```typescript
setKeyboardEventListeners(): void
```

**Supported Keys:**
- `ArrowLeft` / `a` - Move left
- `ArrowRight` / `d` - Move right
- `Space` - Shoot
- `p` - Start new game (when not playing)

##### `setMouseEventListeners()`

Initializes mouse input handling.

```typescript
setMouseEventListeners(): void
```

##### `setTouchEventListeners()`

Initializes touch input for mobile devices.

```typescript
setTouchEventListeners(): void
```

**Touch Controls:**
- Touch left side of screen - Move left and shoot
- Touch right side of screen - Move right and shoot

##### `getMousePosition(event, canvas)`

Converts screen coordinates to canvas coordinates.

```typescript
getMousePosition(
  event: MouseEvent | TouchInit, 
  canvas: HTMLCanvasElement
): {x: number, y: number}
```

### UI Class

Manages game interface rendering.

```typescript
class Ui implements IUi
```

#### Public Methods

##### `draw(context: CanvasRenderingContext2D)`

Renders score, level, lives, and game state messages.

```typescript
draw(context: CanvasRenderingContext2D): void
```

**UI Elements:**
- Score display (top-left)
- Level display (top-left)
- Lives remaining (top-right, shown as mini ships)
- Game Over screen
- Life Lost transition screen

### Background Classes

#### Background Class

Manages parallax scrolling background layers.

```typescript
class Background implements IBackground
```

##### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `layer1` | Layer | Background galaxy layer |
| `layer2` | Layer | Foreground stars layer |

##### Public Methods

##### `update(delta: number)`

Updates all background layers for scrolling effect.

```typescript
update(delta: number): void
```

#### Layer Class

Individual scrolling background layer.

```typescript
class Layer implements ILayer
```

##### Public Methods

##### `update(delta: number)`

Updates layer position for continuous scrolling.

```typescript
update(delta: number): void
```

##### `draw(context: CanvasRenderingContext2D)`

Renders the layer with seamless tiling.

```typescript
draw(context: CanvasRenderingContext2D): void
```

### Audio Classes

#### Sound Effect Classes

All sound effects use the ZzFX library for procedural audio generation.

##### `Shoot`

Player shooting sound effect.

```typescript
class Shoot {
  play(): void
}
```

##### `Hit`

Enemy hit sound effect.

```typescript
class Hit {
  play(): void
}
```

##### `Explosion1`

Enemy destruction sound effect.

```typescript
class Explosion1 {
  play(): void
}
```

##### `PlayerExplosion`

Player destruction sound effect.

```typescript
class PlayerExplosion {
  play(): void
}
```

## Utility Functions

### Math Utilities (`src/lib/util.ts`)

#### `randomBetween(min: number, max: number)`

Generates a random number within a specified range.

```typescript
function randomBetween(min: number, max: number): number
```

**Parameters:**
- `min` (number) - Minimum value (inclusive)
- `max` (number) - Maximum value (exclusive)

**Returns:**
- `number` - Random value between min and max

**Usage Example:**
```typescript
const speed = randomBetween(0.1, 0.5); // Random speed between 0.1 and 0.5
const position = randomBetween(0, canvas.width); // Random X position
```

#### `makeRandomPositiveOrNegative(number: number)`

Randomly makes a number positive or negative.

```typescript
function makeRandomPositiveOrNegative(number: number): number
```

**Parameters:**
- `number` (number) - Input number

**Returns:**
- `number` - Input number with random sign

**Usage Example:**
```typescript
const direction = makeRandomPositiveOrNegative(1); // Returns 1 or -1
const velocity = makeRandomPositiveOrNegative(speed); // Random direction
```

#### `isMobile()`

Detects if the user is on a mobile device.

```typescript
function isMobile(): boolean
```

**Returns:**
- `boolean` - True if mobile device detected

**Usage Example:**
```typescript
if (isMobile()) {
  // Show touch-optimized UI
  button.textContent = 'Tap to Play';
} else {
  button.textContent = 'Click to Play';
}
```

### Movement Functions (`src/lib/movements.ts`)

#### `calculateSineWave(options)`

Calculates sine wave movement for smooth horizontal motion.

```typescript
function calculateSineWave({
  yPosition: number,
  xStart: number,
  viewportWidth: number
}): number
```

**Parameters:**
- `yPosition` (number) - Current Y position (affects wave phase)
- `xStart` (number) - Starting X position
- `viewportWidth` (number) - Canvas width for bounds

**Returns:**
- `number` - Calculated X position

**Usage Example:**
```typescript
// Create smooth sine wave movement for BigEars enemy
const newX = calculateSineWave({
  yPosition: enemy.y,
  xStart: enemy.xStart,
  viewportWidth: game.width - 100
});
```

#### `chaseMovement(options)`

Calculates chase movement towards a target with sine wave variation.

```typescript
function chaseMovement({
  playerX: number,
  playerY: number,
  enemyX: number,
  enemyY: number,
  speed: number,
  delta: number,
  xMultiply?: number,
  yMultiply?: number,
  direction?: number
}): {x: number, y: number}
```

**Parameters:**
- `playerX` (number) - Target X position
- `playerY` (number) - Target Y position
- `enemyX` (number) - Current enemy X position
- `enemyY` (number) - Current enemy Y position
- `speed` (number) - Movement speed
- `delta` (number) - Time delta
- `xMultiply` (number, optional) - X speed multiplier (default: 4)
- `yMultiply` (number, optional) - Y speed multiplier (default: 1)
- `direction` (number, optional) - Sine wave direction (default: 1)

**Returns:**
- `{x: number, y: number}` - New position coordinates

**Usage Example:**
```typescript
// Make ScaryGeek enemy chase the player
const newPos = chaseMovement({
  playerX: game.player.x,
  playerY: game.player.y,
  enemyX: enemy.x,
  enemyY: enemy.y,
  speed: 2,
  delta: delta / 10,
  xMultiply: 1 + game.level,
  yMultiply: 0.5 + game.level / 10
});
enemy.x = newPos.x;
enemy.y = newPos.y;
```

## Type Definitions

### Enumerations

#### `GameMode`

Defines the different states of the game.

```typescript
enum GameMode {
  INTRO = 'INTRO',              // Pre-intro screen (audio selection)
  IDLE = 'IDLE',                // Intro screen with menu
  PLAYING = 'PLAYING',          // Active gameplay
  DIETRANSITION = 'DIETRANSITION', // Player death animation
  LEVELTRANSITION = 'LEVELTRANSITION', // Level transition screen
  GAMEOVER = 'GAMEOVER'         // Game over screen
}
```

### Interface Definitions

#### `IGame`

Main game interface defining the core game contract.

```typescript
interface IGame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | undefined;
  width: number;
  height: number;
  
  // Game components
  background: IBackground;
  splashScreen: ISplashScreen;
  ui: IUi;
  player: IPlayer;
  inputHandler: IInputHandler;
  
  // Game state
  keys: string[];
  enemyWave: IEnemy[];
  particles: IParticle[];
  gameSpeed: number;
  score: number;
  lives: number;
  level: number;
  fps: number;
  gameMode: GameMode;
  audioEnabled: boolean;
  
  // Core methods
  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  addEnemyWave(): void;
  enemyShoot(enemy: IEnemy): void;
  createParticles(count: number, target: IEnemy | IPlayer): void;
  detectCollision(rect1: IPlayer | IProjectile, rect2: IEnemy): boolean;
  initGame(fullReset: boolean): void;
}
```

#### `IPlayer`

Player interface defining player ship capabilities.

```typescript
interface IPlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  maxSpeed: number;
  projectiles: IProjectile[];
  canShoot: boolean;
  shotsPerSecond: number;
  
  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  shoot(): void;
}
```

#### `IEnemy`

Enemy interface defining enemy behavior.

```typescript
interface IEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  lives: number;
  speed: number;
  canShoot: boolean;
  markedForDeletion: boolean;
  
  update(delta: number): void;
  draw(context: CanvasRenderingContext2D): void;
  playHitSound(): void;
  playExplosionSound(): void;
}
```

## Usage Examples

### Creating a New Game

```typescript
// Initialize canvas and context
const canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// Set canvas dimensions
canvas.width = 960;
canvas.height = 1600;

// Create game instance
const game = new Game(canvas, context);

// Start the game
game.initGame(true); // Full reset with score/lives
game.gameMode = GameMode.PLAYING;

// Game loop
function gameLoop(timestamp: number) {
  const delta = timestamp - previousTimestamp;
  
  game.update(delta);
  if (context) {
    game.draw(context);
  }
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

### Adding Custom Enemy Types

```typescript
class CustomEnemy extends Enemy {
  constructor(game: IGame) {
    super(game);
    this.width = 80;
    this.height = 60;
    this.lives = 5;
    this.speed = 0.2;
    this.canShoot = true;
    
    // Load custom sprite
    this.image = new Image();
    this.image.src = 'custom-enemy.png';
  }
  
  update(delta: number) {
    super.update(delta);
    
    // Custom movement pattern
    this.x += Math.sin(this.y * 0.01) * 2;
    this.y += this.speed * delta;
  }
}

// Add to game
game.enemyWave.push(new CustomEnemy(game));
```

### Handling Game Events

```typescript
// Listen for game state changes
function handleGameStateChange(newMode: GameMode) {
  switch (newMode) {
    case GameMode.PLAYING:
      console.log('Game started');
      break;
    case GameMode.GAMEOVER:
      console.log(`Game over! Final score: ${game.score}`);
      break;
    case GameMode.LEVELTRANSITION:
      console.log(`Advancing to level ${game.level}`);
      break;
  }
}

// Monitor game mode changes
let previousMode = game.gameMode;
setInterval(() => {
  if (game.gameMode !== previousMode) {
    handleGameStateChange(game.gameMode);
    previousMode = game.gameMode;
  }
}, 100);
```

### Creating Particle Effects

```typescript
// Create explosion at specific location
function createExplosionAt(x: number, y: number, particleCount: number = 100) {
  for (let i = 0; i < particleCount; i++) {
    const particle = new Particle(game, x, y);
    game.particles.push(particle);
  }
}

// Use in collision detection
if (game.detectCollision(player, enemy)) {
  createExplosionAt(
    enemy.x + enemy.width / 2,
    enemy.y + enemy.height / 2,
    200
  );
}
```

### Audio Management

```typescript
// Toggle audio globally
function toggleAudio(enabled: boolean) {
  game.audioEnabled = enabled;
  
  // Update UI
  const audioButton = document.querySelector('#audio-toggle');
  audioButton.textContent = enabled ? '🔊' : '🔇';
}

// Play custom sound effects
if (game.audioEnabled) {
  const hitSound = new Hit();
  hitSound.play();
}
```

### Mobile Touch Controls

```typescript
// Enhanced touch controls
function setupTouchControls(canvas: HTMLCanvasElement, game: IGame) {
  let touchStartX = 0;
  
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchStartX = (touch.clientX - rect.left) * (canvas.width / rect.width);
  });
  
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    
    // Update player movement based on swipe
    if (currentX < touchStartX - 20) {
      game.keys = ['ArrowLeft'];
    } else if (currentX > touchStartX + 20) {
      game.keys = ['ArrowRight'];
    }
  });
  
  canvas.addEventListener('touchend', () => {
    game.keys = [];
  });
}
```

---

## Performance Considerations

### Optimization Tips

1. **Object Pooling**: Reuse projectile and particle objects instead of creating new ones
2. **Efficient Collision Detection**: Use spatial partitioning for large numbers of entities
3. **Sprite Batching**: Group similar sprites to reduce draw calls
4. **Audio Management**: Limit concurrent sound effects to prevent audio lag

### Memory Management

- Clean up marked entities every frame
- Avoid memory leaks with proper event listener cleanup
- Use `WeakMap` for temporary object associations
- Implement object pooling for frequently created/destroyed objects

---

This documentation covers all public APIs, functions, and components in the Attack of the Space Nerds game. For additional implementation details, refer to the source code and inline comments.