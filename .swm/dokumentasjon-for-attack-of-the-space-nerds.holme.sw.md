---
id: holme
title: Dokumentasjon for "Attack of the Space Nerds"
file_version: 1.1.1
app_version: 1.0.19
---

## Spillet

<br/>

<br/>

Her er game-loopen. Den går hit og den går dit, og den går rundt en liten bit. Den er en evighetsmaskin!
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/main.ts
```typescript
18       // *******************
19       // Game animation loop
20       // *******************
21       let previousTimeStamp: number = 0;
22       let delta: number = 0;
23       let totalTime: number = 0;
24       let splashHasBeenDrawn: boolean = false;
25     
26       function gameLoop(timestamp: number) {
27         delta = timestamp - previousTimeStamp;
28         previousTimeStamp = timestamp;
29         totalTime += delta;
30     
31         // Mostly for debugging purposes
32         game.fps = Math.round(1000 / delta);
33         game.gameTime = totalTime / 1000;
34     
35         switch (game.getGameMode()) {
36           case 'IDLE':
37             if (context !== null && !splashHasBeenDrawn) {
38               splashHasBeenDrawn = true;
39               context.clearRect(0, 0, canvas.width, canvas.height);
40               splashScreen.splashImage.onload = () => {
41                 splashScreen.draw(context);
42               };
43             }
44             splashScreen.draw(context);
45             splashScreen.update();
46             break;
47     
48           default:
49             splashHasBeenDrawn = false;
50             game.update(delta);
51             if (context !== null) game.draw(context);
52         }
53     
54         requestAnimationFrame(gameLoop);
55       }
56       gameLoop(0);
```

<br/>

Alt starter i klassen `Game`<swm-token data-swm-token=":src/classes/game.ts:17:4:4:`export class Game {`"/> som du finner her`📄 src/classes/game.ts`

<br/>

<br/>


<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/classes/enemy.ts
```typescript
155      constructor(game: Game, enemyX: number, enemyY: number) {
156        super(game);
157        this.x = enemyX;
158        this.y = enemyY;
159        this.verticalSpeed = randomBetween(0.1, 0.4);
160        this.width = 56;
161        this.height = 54;
162        this.maxFrame = 23;
163        this.frame = Math.floor(Math.random() * this.maxFrame);
164        this.multisprite = false;
165        this.image = new Image();
166        this.image.src = enemyShotImage;
167        this.lives = 1;
168        this.score = this.lives;
169        this.canShoot = false;
170      }
```

<br/>

<br/>

`📄 src/lib/util.ts`

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBYXR0YWNrLW9mLXRoZS1zcGFjZS1uZXJkcyUzQSUzQWtsZWthbmdlcg==/docs/holme).