import "./style.css";

const rotationMatrix = (
  centerX: number,
  centerY: number,
  x: number,
  y: number,
  radians: number
) => {
  const rotatedX =
    centerX +
    (x - centerX) * Math.cos(radians) -
    (y - centerY) * Math.sin(radians);
  const rotatedY =
    centerY +
    (x - centerX) * Math.sin(radians) +
    (y - centerY) * Math.cos(radians);

  return { rotatedX, rotatedY };
};
