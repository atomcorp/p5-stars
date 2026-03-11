import type { Position } from "./types";

const halfPi = Math.PI / 180;

export const convertPolarToCartesian = (
  origin: Position,
  distance: number,
  degrees: number
): Position => {
  const radians = degrees * halfPi;

  return {
    x: origin.x + distance * Math.cos(radians),
    y: origin.y + distance * Math.sin(radians),
  };
};

export const degreesToRadians = (deg: number) => deg * (Math.PI / 180);

export const normalize = (
  value: number,
  currentScaleMin: number,
  currentScaleMax: number,
  newScaleMin: number = 0,
  newScaleMax: number = 1
): number => {
  const standardNormalization =
    (value - currentScaleMin) / (currentScaleMax - currentScaleMin);

  return (newScaleMax - newScaleMin) * standardNormalization + newScaleMin;
};
