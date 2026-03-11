import "./style.css";

import { createArc } from "./createArc";
import { createCrescentMoon } from "./createCrescentMoon";
import { createStar } from "./createStar";

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

const ORBIT_POINT = {
  x: canvas.width / 2,
  y: 0,
};

let lastTime = 0;
let animationId;

const drawArc = createArc(ctx, ORBIT_POINT, {
  arcLengthInDegrees: 90,
  radius: 40,
  speed: MAX_ARC,
});

const drawStar = createStar(ctx, ORBIT_POINT, {
  radius: 70,
  speed: MIN_SPEED,
  spinSpeed: MAX_SPIN,
  startSpinDegrees: 90,
  size: {
    outerRadius: 10,
    innerRadius: 5,
  },
});

const drawBigStar = createStar(ctx, ORBIT_POINT, {
  radius: 150,
  speed: 20,
  spinSpeed: MIN_SPIN,
  startSpinDegrees: 90,
  size: {
    outerRadius: 50,
    innerRadius: 35,
  },
});

const drawCrescentMoonx = createCrescentMoon(ctx, ORBIT_POINT, {
  radius: 100, // distance from pivot,
  speed: 20,
  spinSpeed: 50,
  size: {
    outerRadius: 40,
    innerRadius: 30,
    offset: 30,
  },
});

const draw = (currentTime: number) => {
  if (lastTime === 0) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStar(deltaTime);
  drawBigStar(deltaTime);
  drawArc(deltaTime);

  drawCrescentMoonx(deltaTime);

  animationId = self.requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
