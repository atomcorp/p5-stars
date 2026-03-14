import type { Position } from "./types";
import { convertPolarToCartesian, isInView } from "./utils";

export type StarParams = {
  startRotation: number;
  radius: number; // distance from center
  speed: number;
  startSpinDegrees: number; // in degrees
  spinSpeed: number;
  color: string;
  size: {
    outerRadius: number;
    innerRadius: number;
  };
};
type State = {
  rotation: number;
  spin: number;
};

const points = 5;
const step = Math.PI / points; // 36 degrees in radians

export const createStar = (
  ctx: CanvasRenderingContext2D,
  center: Position,
  params: StarParams
) => {
  const {
    radius,
    color,
    speed,
    spinSpeed,
    startRotation,
    startSpinDegrees,
    size: { outerRadius, innerRadius },
  } = params;

  const state: State = {
    rotation: startRotation,
    spin: startSpinDegrees,
  };

  const size = {
    width: outerRadius,
    height: outerRadius,
  };

  const drawStar = (
    deltaTime: number,
    canvas: { width: number; height: number }
  ): void => {
    state.spin += spinSpeed * deltaTime;
    state.rotation += speed * deltaTime;

    const pos = convertPolarToCartesian(
      center,
      radius,
      state.rotation - outerRadius
    );

    const inView = isInView(pos, size, canvas);

    if (inView) {
      let offsetRotation = 0 + state.spin;

      ctx.beginPath();

      for (let i = 0; i < points * 2; i++) {
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
      ctx.fillStyle = color;
      ctx.fill();
      // ctx.stroke();
    }

    if (state.rotation > 360) {
      state.rotation = 0;
    }
    // tbh i don't understand why this works, there are 5 points to the star
    if (state.spin > startSpinDegrees + points) {
      state.spin = startSpinDegrees;
    }
  };

  return drawStar;
};
