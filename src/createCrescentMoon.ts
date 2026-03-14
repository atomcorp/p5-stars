import type { Position } from "./types";
import { convertPolarToCartesian, isInView } from "./utils";

export type CrescentMoonParams = {
  radius: number; // distance from center
  speed: number;
  spinSpeed: number;
  startRotation: number;
  startSpinDegrees: number;
  color: string;
  size: {
    outerRadius: number;
    innerRadius: number;
    offset: number; // how far from the center is the inner circle
  };
};
type State = {
  rotation: number;
  spin: number;
};

export const createCrescentMoon = (
  ctx: CanvasRenderingContext2D,
  center: Position,
  params: CrescentMoonParams
) => {
  const {
    radius,
    speed,
    spinSpeed,
    size,
    startRotation,
    startSpinDegrees,
    color,
  } = params;
  const offscreenCanvas = new OffscreenCanvas(50, 50);
  const offscreenCtx = offscreenCanvas.getContext("2d")!;
  offscreenCanvas.width = size.outerRadius * 2;
  offscreenCanvas.height = size.outerRadius * 2;

  const state: State = {
    rotation: startRotation,
    spin: startSpinDegrees,
  };

  const drawCrescentMoon = (
    deltaTime: number,
    canvas: { width: number; height: number }
  ) => {
    state.spin += spinSpeed * deltaTime;
    state.rotation += speed * deltaTime;
    const pos = convertPolarToCartesian(center, radius, state.rotation);

    const inView = isInView(
      pos,
      { width: offscreenCanvas.width, height: offscreenCanvas.height },
      canvas
    );

    if (inView) {
      offscreenCtx.save();
      // set up the part that ecllipses
      const innerRadius = size.innerRadius;
      const offset = size.offset;
      const crescentPosition = convertPolarToCartesian(
        {
          x: offscreenCanvas.width / 2,
          y: offscreenCanvas.width / 2,
        },
        offset,
        state.spin
      );

      // draw the containing circle
      offscreenCtx.beginPath();
      offscreenCtx.arc(
        offscreenCanvas.width / 2,
        offscreenCanvas.height / 2,
        size.outerRadius,
        0,
        Math.PI * 2,
        false
      );

      offscreenCtx.fillStyle = color;
      offscreenCtx.fill();

      offscreenCtx.globalCompositeOperation = "destination-out";

      // draw the ecllipsing circle
      offscreenCtx.beginPath();
      offscreenCtx.arc(
        crescentPosition.x,
        crescentPosition.y,
        innerRadius,
        Math.PI * 2,
        0,
        true
      );
      offscreenCtx.fill();

      offscreenCtx.restore();

      // draw on the actual canvas
      ctx.drawImage(offscreenCanvas, pos.x, pos.y);
    }

    if (state.rotation > 360) {
      state.rotation = 0;
    }

    if (state.spin > 360) {
      state.spin = 0;
    }
  };

  return drawCrescentMoon;
};
