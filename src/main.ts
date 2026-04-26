import "./style.css";

import { createArc, type ArcParams } from "./createArc";
import {
  createCrescentMoon,
  type CrescentMoonParams,
} from "./createCrescentMoon";
import { createStar, type StarParams } from "./createStar";
import { getArcColor, getStarColor, randomLerp, shuffleArray } from "./utils";

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

const getRandomArcs = () => {
  const arcs = [];
  for (let index = 0; index < 10; index++) {
    const arcParam: ArcParams = {
      arcLengthInDegrees: randomLerp(10, 160),
      radius: randomLerp(0, canvas.height),
      speed: randomLerp(MIN_ARC, MAX_ARC),
      color: getArcColor(),
      startRotation: randomLerp(0, 360),
    };
    arcs.push(createArc(ctx, ORBIT_POINT, arcParam));
  }
  return arcs;
};

const getRandomStarParams = () => {
  const stars = [];
  for (let index = 0; index < 60; index++) {
    const outerSize = randomLerp(35, 60);
    const innerSize = randomLerp(outerSize - 15, outerSize - 20);
    const starParam: StarParams = {
      radius: randomLerp(canvas.height - canvas.height * 0.4, canvas.height),
      speed: randomLerp(MIN_SPEED, MAX_SPEED),
      spinSpeed: randomLerp(MIN_SPIN, MAX_SPIN),
      startSpinDegrees: randomLerp(0, 360),
      startRotation: randomLerp(0, 360),
      color: getStarColor(),
      size: {
        outerRadius: outerSize,
        innerRadius: innerSize,
      },
    };
    stars.push(createStar(ctx, ORBIT_POINT, starParam));
  }

  return stars;
};

const getRandomCrescentMoonParams = () => {
  const crescentMoonParams = [];
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
      color: getStarColor(),
      size: {
        outerRadius: outerSize,
        innerRadius: innerSize,
        offset,
      },
    };
    crescentMoonParams.push(
      createCrescentMoon(ctx, ORBIT_POINT, crescentMoonParam)
    );
  }
  return crescentMoonParams;
};

const stars = getRandomStarParams();
const crescentMoons = getRandomCrescentMoonParams();
const arcs = getRandomArcs();

const particles = [...crescentMoons, ...stars, ...arcs];

shuffleArray(particles);

const draw = (currentTime: number) => {
  if (lastTime === 0) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle(deltaTime, { width: canvas.width, height: canvas.height });
  });

  self.requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
