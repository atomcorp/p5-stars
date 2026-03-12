import "./style.css";

import { createArc } from "./createArc";
import { createCrescentMoon } from "./createCrescentMoon";
import { createStar, type StarParams } from "./createStar";
import { randomLerp } from "./utils";

/**
 * The basic way to move is x = x + velocityX; or x += velocity
 */

const canvas = document.getElementById("app") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No ctx");
}

const MIN_SPEED = 5;
const MAX_SPEED = 10;
const MIN_SPIN = 0.2;
const MAX_SPIN = 1.5;
const MIN_ARC = 5;
const MAX_ARC = 10;

const ORBIT_POINT = {
  x: canvas.width / 2,
  y: 0 - canvas.height * 0.25,
};

let lastTime = 0;
let animationId;

const drawArc = createArc(ctx, ORBIT_POINT, {
  arcLengthInDegrees: 90,
  radius: 200,
  speed: MAX_ARC,
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

const getRandomStarParams = () => {
  const stars: StarParams[] = [];
  for (let index = 0; index < 40; index++) {
    const outerSize = randomLerp(50, 60);
    const innerSize = randomLerp(outerSize - 15, outerSize - 20);
    const starParam = {
      radius: randomLerp(canvas.height - canvas.height * 0.2, canvas.height),
      speed: randomLerp(MIN_SPEED, MAX_SPEED),
      spinSpeed: randomLerp(MIN_SPIN, MAX_SPIN),
      startSpinDegrees: randomLerp(0, 360),
      startRotation: randomLerp(0, 360),
      size: {
        outerRadius: outerSize,
        innerRadius: innerSize,
      },
    };
    stars.push(starParam);
  }

  return stars;
};

const starParams = getRandomStarParams();
const stars = starParams.map((params) => createStar(ctx, ORBIT_POINT, params));

const draw = (currentTime: number) => {
  if (lastTime === 0) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.map((drawStar) => {
    drawStar(deltaTime);
  });

  drawCrescentMoonx(deltaTime);
  drawArc(deltaTime);

  animationId = self.requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
