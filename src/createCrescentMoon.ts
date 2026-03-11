import type { Position } from "./types";
import { convertPolarToCartesian } from "./utils";

type Params = {
  radius: number; // distance from center
  speed: number;
  spinSpeed: number;
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
  params: Params
) => {
  const { radius, speed, spinSpeed, size } = params;
  const offscreenCanvas = new OffscreenCanvas(50, 50);
  const offscreenCtx = offscreenCanvas.getContext("2d")!;

  const state: State = {
    rotation: 0,
    spin: 0,
  };

  const drawCrescentMoon = (deltaTime: number) => {
    state.spin += spinSpeed * deltaTime;
    state.rotation += speed * deltaTime;

    // set up the offscreen canvas to the size of the shape
    offscreenCanvas.width = size.outerRadius * 2;
    offscreenCanvas.height = size.outerRadius * 2;
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

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

    offscreenCtx.fillStyle = "white";
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
    const pos = convertPolarToCartesian(center, radius, state.rotation);
    ctx.drawImage(offscreenCanvas, pos.x, pos.y);

    if (state.rotation > 360) {
      state.rotation = 0;
    }

    if (state.spin > 360) {
      state.spin = 0;
    }
  };

  return drawCrescentMoon;
};
