import { polarToCartesianCoordinates } from "../Clock/clock.utils";
export const getArcPath = (
  startAngle: number,
  endAngle: number,
  RADIUS: number,
  CENTER: { X: number; Y: number }
) => {
  const start = polarToCartesianCoordinates(RADIUS, startAngle);
  const end = polarToCartesianCoordinates(RADIUS, endAngle);

  const angleDiff = endAngle - startAngle;

  const arcStartX = CENTER.X + start.x;
  const arcStartY = CENTER.Y + start.y;

  const arcEndX = CENTER.X + end.x;
  const arcEndY = CENTER.Y + end.y;

  // it will draw like we humans draw without lifting pen and
  // command L will start the point from the previously left point
  const d = [
    "M",
    arcStartX,
    arcStartY,
    "A",
    RADIUS, // ellipsis horizontal axis
    RADIUS, // ellipsis vertical axis
    0,
    angleDiff > 180 ? 1 : 0, // 0 or 1 // large arc angle every arc ends can be joined using 2 ways larger and smaller
    1, // which side to draw curve 1 means away from center 0 from towards center
    arcEndX,
    arcEndY,
    "L", // represents line
    CENTER.X, // line start
    CENTER.Y, // line end
    "L",
    arcStartX,
    arcStartY,
  ];
  if (angleDiff === 360) {
    d.push("Z");
  }
  return d.join(" ");
};
