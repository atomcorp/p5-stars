import "./style.css";

import { createArc } from "./createArc";
import {
  createCrescentMoon,
  type CrescentMoonParams,
} from "./createCrescentMoon";
import { createStar, type StarParams } from "./createStar";
import { getColor, randomLerp, shuffleArray } from "./utils";

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
const MIN_SPIN = 0.3;
const MAX_SPIN = 1.2;
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

const getRandomStarParams = () => {
  const stars: StarParams[] = [];
  for (let index = 0; index < 60; index++) {
    const outerSize = randomLerp(35, 60);
    const innerSize = randomLerp(outerSize - 15, outerSize - 20);
    const starParam: StarParams = {
      radius: randomLerp(canvas.height - canvas.height * 0.4, canvas.height),
      speed: randomLerp(MIN_SPEED, MAX_SPEED),
      spinSpeed: randomLerp(MIN_SPIN, MAX_SPIN),
      startSpinDegrees: randomLerp(0, 360),
      startRotation: randomLerp(0, 360),
      color: getColor(),
      size: {
        outerRadius: outerSize,
        innerRadius: innerSize,
      },
    };
    stars.push(starParam);
  }

  return stars;
};

const getRandomCrescentMoonParams = () => {
  const crescentMoonParams: CrescentMoonParams[] = [];
  for (let index = 0; index < 60; index++) {
    const outerSize = randomLerp(30, 60);
    const innerSize = randomLerp(outerSize - 15, outerSize - 20);
    const offset = randomLerp(outerSize - 2, outerSize - 15);
    const crescentMoonParam: CrescentMoonParams = {
      radius: randomLerp(canvas.height - canvas.height * 0.4, canvas.height),
      speed: randomLerp(MIN_SPEED, MAX_SPEED),
      spinSpeed: randomLerp(20, 40),
      startSpinDegrees: randomLerp(0, 360),
      startRotation: randomLerp(0, 360),
      color: getColor(),
      size: {
        outerRadius: outerSize,
        innerRadius: innerSize,
        offset,
      },
    };
    crescentMoonParams.push(crescentMoonParam);
  }
  return crescentMoonParams;
};

const starParams = getRandomStarParams();
const stars = starParams.map((params) => createStar(ctx, ORBIT_POINT, params));
const crescentMoonParams = getRandomCrescentMoonParams();
const crescentMoons = crescentMoonParams.map((params) =>
  createCrescentMoon(ctx, ORBIT_POINT, params)
);

const particles = [...crescentMoons, ...stars];

shuffleArray(particles);

const draw = (currentTime: number) => {
  if (lastTime === 0) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle(deltaTime, { width: canvas.width, height: canvas.height });
  });

  drawArc(deltaTime);

  animationId = self.requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
