import "./style.css";

const rotationMatrix = (
  centerX: number,
  centerY: number,
  x: number,
  y: number,
  radians: number
) => {
  const rotatedX =
    centerX +
    (x - centerX) * Math.cos(radians) -
    (y - centerY) * Math.sin(radians);
  const rotatedY =
    centerY +
    (x - centerX) * Math.sin(radians) +
    (y - centerY) * Math.cos(radians);

  return { rotatedX, rotatedY };
};

function rotatePoint(point: Position, pivot: Position, angleInRadians: number) {
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  // Translate to origin, rotate, then translate back
  const nx = cos * (point.x - pivot.x) - sin * (point.y - pivot.y) + pivot.x;
  const ny = sin * (point.x - pivot.x) + cos * (point.y - pivot.y) + pivot.y;

  return { x: nx, y: ny };
}

const halfPi = Math.PI / 180;

function convertPolarToCartesian(
  distance: number,
  degrees: number,
  origin: Position = PIVOT
): Position {
  const radians = degrees * halfPi;

  return {
    x: origin.x + distance * Math.cos(radians),
    y: origin.y + distance * Math.sin(radians),
  };
}

/**
 * The basic way to move is x = x + velocityX; or x += velocity

 */

const canvas = document.getElementById("app") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No ctx");
}

const MIN_SPEED = 20;
const MAX_SPEED = 40;
const MIN_SPIN = 0.5;
const MAX_SPIN = 3;
const MIN_ARC = 10;
const MAX_ARC = 30;

const PIVOT = {
  x: canvas.width / 2,
  y: 0,
};

type Position = {
  x: number;
  y: number;
};

const degreesToRadians = (deg: number) => deg * (Math.PI / 180);

function rotate(pos: Position, angleInRadians: number): Position {
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  return {
    x: pos.x * cos - pos.y * sin,
    y: pos.x * sin + pos.y * cos,
  };
}

const newPosition = (x: number, y: number): Position => {
  return {
    x,
    y,
  };
};

const drawSquare = (pos: Position) => {
  const sqSize = 5;

  ctx.fillStyle = "white";
  ctx.fillRect(pos.x, pos.y, sqSize, sqSize);
};

const drawStar = (
  pos: Position,
  rotation: number,
  outerRadius: number,
  innerRadius: number = outerRadius / 2.5
): void => {
  const points = 5;
  const step = Math.PI / points; // 36 degrees in radians
  let offsetRotation = -Math.PI / 2 + rotation; // Start pointing straight up

  ctx.beginPath();

  // We need 10 points total (5 tips, 5 notches)
  for (let i = 0; i < points * 2; i++) {
    // Alternate between outer and inner radius
    const r = i % 2 === 0 ? outerRadius : innerRadius;

    const x = pos.x + Math.cos(offsetRotation) * r;
    const y = pos.y + Math.sin(offsetRotation) * r;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    offsetRotation += step;
  }

  ctx.closePath();
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.stroke();
  // ctx.closePath();
};

const drawArc = (degrees: number, length: number, distance: number) => {
  const start = degreesToRadians(degrees - length);
  const end = start + degreesToRadians(length);
  ctx.beginPath();
  ctx.arc(PIVOT.x, PIVOT.y, distance, start, end);
  ctx.stroke();
};

// const crescentMoonCanvas = document.createElement('canvas');
// const crescentMoonCtx = crescentMoonCanvas.getContext('2d')!;
const crescentMoonCanvas = new OffscreenCanvas(50, 50);
const crescentMoonCtx = crescentMoonCanvas.getContext("2d")!;

const drawCrescentMoon = (pos: Position, radius: number, degrees: number) => {
  ctx.fillStyle = "red";
  ctx.fillRect(100, 100, 100, 100);

  //
  crescentMoonCanvas.width = radius * 2 + 50;
  crescentMoonCanvas.height = radius * 2 + 50;
  crescentMoonCtx.clearRect(
    0,
    0,
    crescentMoonCanvas.width,
    crescentMoonCanvas.height
  );

  crescentMoonCtx.save();
  const innerRadius = radius - 15;
  const offset = radius - (innerRadius - 20);
  const crescentPosition = convertPolarToCartesian(offset, degrees, pos);

  crescentMoonCtx.beginPath();
  crescentMoonCtx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);

  // crescentMoonCtx.clip();

  // crescentMoonCtx.moveTo(crescentPosition.x + innerRadius, crescentPosition.y);
  // crescentMoonCtx.arc(
  //   crescentPosition.x,
  //   crescentPosition.y,
  //   innerRadius,
  //   0,
  //   Math.PI * 2,
  //   true
  // );

  // crescentMoonCtx.fillStyle = "white";
  // crescentMoonCtx.fill("evenodd"); // Use 'even-odd' to fill only the area where the paths don't overlap
  // ctx.clip();
  // good
  crescentMoonCtx.fillStyle = "white";
  crescentMoonCtx.fill();

  crescentMoonCtx.globalCompositeOperation = "destination-out";
  crescentMoonCtx.beginPath();
  crescentMoonCtx.arc(
    crescentPosition.x,
    crescentPosition.y,
    innerRadius,
    Math.PI * 2,
    0,
    true
  );
  crescentMoonCtx.fill();

  crescentMoonCtx.restore();

  ctx.drawImage(
    crescentMoonCanvas,
    pos.x - (radius + 25),
    pos.y - (radius + 25)
  );
};

let rotation = 0;
let starRotation = 0;
let arcRotation = 0; // degreesToRadians(degrees) - degreesToRadians(degrees);

let lastTime = 0;
let starSpin = 0;
let animationId;

const draw = (currentTime: number) => {
  if (lastTime === 0) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const distance = 100; // distance from Pivot center

  // example square
  const pos = convertPolarToCartesian(distance, rotation);
  rotation += MAX_SPEED * deltaTime;
  drawSquare(pos);

  // example star
  starSpin += MAX_SPIN * deltaTime;
  starRotation += MIN_SPEED * deltaTime;
  const starDistance = 55;
  const starPos = convertPolarToCartesian(starDistance, starRotation);
  drawStar(starPos, starSpin, 10, 5);

  const bigStarPos = convertPolarToCartesian(250, starRotation);
  drawStar(bigStarPos, starSpin, 50, 35);

  //arc
  arcRotation += MAX_ARC * deltaTime;
  const arcLength = 90; // degrees
  drawArc(arcRotation, arcLength, 40);

  drawCrescentMoon({ x: 100, y: 100 }, 50, arcRotation);

  if (starRotation > 180 + 10) {
    starRotation = 0;
  }
  if (rotation > 180 - 5) {
    rotation = 0;
  }

  if (arcRotation > 180 + arcLength) {
    arcRotation = 0;
  }

  animationId = self.requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
