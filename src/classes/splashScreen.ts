interface SplashScreenProps {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

export class SplashScreen {
  width: number;
  height: number;
  zoom: number;
  zoomDirection: number;
  splashImage: HTMLImageElement;
  backgroundColor: string;
  textColor1: string;
  textColor2: string;
  textPressToPlay: string;
  canvas: HTMLCanvasElement;
  canvasW: number;
  canvasH: number;
  highlightText: boolean;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  isHoveringPressToPlay: boolean;

  constructor({ width, height, canvas }: SplashScreenProps) {
    this.width = width;
    this.height = height;
    this.zoom = 1.0;
    this.zoomDirection = 0.0002;
    this.splashImage = new Image();
    this.backgroundColor = 'rgba(0 0 0 / 0.7)';
    this.textColor1 = 'rgba(215 225 230 / 1)';
    this.textColor2 = 'rgba(95 131 127 / 1)';
    this.textPressToPlay = 'Space to start';
    this.canvas = canvas;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;
    this.highlightText = false;
    this.#setEventListeners();
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.isHoveringPressToPlay = false;
  }

  update() {
    // Zoom slowly in and out
    this.zoom += this.zoomDirection;

    if (this.zoom >= 1.5 || this.zoom <= 1.0) {
      this.zoomDirection *= -1;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.clearRect(0, 0, this.width, this.height);

    context.font = `50px 'Press Start 2P'`;

    const PressToPlayTextLength = context.measureText(
      this.textPressToPlay
    ).width;

    const PressToPlayTextHeight =
      context.measureText(this.textPressToPlay).fontBoundingBoxAscent -
      context.measureText(this.textPressToPlay).fontBoundingBoxDescent;

    // Calculate the bounding box for the text
    const textBoundingBox = {
      x: (this.width - PressToPlayTextLength - 40) / 2,
      y: this.height / 2 + 250,
      width: PressToPlayTextLength + 40,
      height: PressToPlayTextHeight + 40,
    };

    // Draw the splash image
    context.drawImage(
      this.splashImage,
      this.width / 2 - (this.width * this.zoom) / 2,
      this.height / 2 - (this.height * this.zoom) / 2,
      this.width * this.zoom,
      this.height * this.zoom
    );

    // Draw the title text
    context.fillStyle = this.backgroundColor;
    context.fillRect(this.width / 2 - 350, this.height / 2 + 30, 700, 160);

    context.fillStyle = this.textColor1;
    context.textAlign = 'center';
    context.fillText('Attack of the', this.width / 2, this.height / 2 + 100);
    context.fillText('Space Nerds', this.width / 2, this.height / 2 + 170);

    // Draw a rectangle with the text "Press space to start"
    context.fillStyle = this.backgroundColor;
    context.fillRect(
      textBoundingBox.x,
      textBoundingBox.y,
      textBoundingBox.width,
      textBoundingBox.height
    );

    // Check if cursor is inside textBoundingBox
    // and set this.isHoveringPressToPlay to true or false
    // then set text color depending on this.isHoveringPressToPlay
    if (
      this.mouseX <= textBoundingBox.x + textBoundingBox.width &&
      this.mouseX >= textBoundingBox.x &&
      this.mouseY >= textBoundingBox.y &&
      this.mouseY <= textBoundingBox.y + textBoundingBox.height
    ) {
      this.isHoveringPressToPlay = true;
    } else {
      this.isHoveringPressToPlay = false;
    }

    this.isHoveringPressToPlay
      ? (context.fillStyle = this.textColor2)
      : (context.fillStyle = this.textColor1);
    context.textAlign = 'center';
    context.fillText('Space to start', this.width / 2, this.height / 2 + 320);

    context.restore();
  }

  // Setter for splashscreen image
  setSplashScreenImage(image: string) {
    this.splashImage.src = image;
  }

  // Add event listener for mouse movements on canvas
  #setEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const { x, y } = this.#getMousePosition(e, this.canvas);
      this.mouseX = x;
      this.mouseY = y;
    });

    // set this.clicked to true when mouse button is pressed
    this.canvas.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    // set this.clicked to false when mouse button is released
    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  #getMousePosition(event: MouseEvent, canvas: HTMLCanvasElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const x = (event.clientX - canvasRect.left) * scaleX;
    const y = (event.clientY - canvasRect.top) * scaleY;

    return { x, y };
  }
}
