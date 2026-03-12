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

    ctx.globalCompositeOperation = "lighter";

    const redraw = (blur: number, width: number) => {
      ctx.beginPath();
      ctx.shadowBlur = blur;
      ctx.shadowColor = "lime";
      ctx.strokeStyle = "lime";
      ctx.lineWidth = width;
      ctx.arc(center.x, center.y, radius, start, end);
      ctx.stroke();
    };

    redraw(20, 2);
    redraw(10, 2);
    redraw(5, 1);

    // cancel effect so it isn't inherited
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";

    // TODO: works but feels hacky
    if (state.rotation > 360) {
      state.rotation = 0;
    }
  };
  return drawArc;
};
