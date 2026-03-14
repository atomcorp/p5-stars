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

export const randomLerp = (min: number, max: number) => {
  return normalize(Math.random(), 0, 1, min, max);
};

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

export const random = (lower: number, upper: number) => {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
};

export const isInView = (
  pos: Position,
  size: { width: number; height: number },
  canvas: { width: number; height: number }
) => {
  if (pos.x + size.width < 0) {
    return false;
  }
  if (pos.x - size.width > canvas.width) {
    return false;
  }
  if (pos.y + size.height < 0) {
    return false;
  }
  if (pos.y - size.height > canvas.height) {
    return false;
  }
  return true;
};

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const color1 = "hsl(57deg 100% 57%)";
const color2 = "hsl(57deg 100% 63%)";
const color3 = "hsl(57deg 100% 46%)";
const color4 = "hsl(57deg 100% 70%)";
const color5 = "hsl(45deg 100% 57%)";
const color6 = "hsl(45deg 100% 70%)";
const colors = [color1, color2, color3, color4, color5, color6];

export const getColor = () => {
  return colors[Math.floor(randomLerp(0, colors.length))];
  // return `hsl(57deg 100% ${normalize(lightness, 0, 1, 50, 70)}%)`;
};
