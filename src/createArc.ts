import type { Position } from "./types";
import { degreesToRadians } from "./utils";

type Params = {
  arcLengthInDegrees: number; //
  radius: number; // distance from center
  speed: number;
};

type State = {
  rotation: 0;
};

export const createArc = (
  ctx: CanvasRenderingContext2D,
  center: Position,
  params: Params
) => {
  const { arcLengthInDegrees, radius, speed } = params;

  const state: State = {
    rotation: 0,
  };

  const drawArc = (deltaTime: number) => {
    state.rotation += speed * deltaTime;
    // offset the start by the length, so it
    const start = degreesToRadians(state.rotation - arcLengthInDegrees);
    const end = start + degreesToRadians(arcLengthInDegrees);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, start, end);
    ctx.stroke();

    // TODO: works but feels hacky
    if (state.rotation > 360) {
      state.rotation = 0;
    }
  };
  return drawArc;
};
