import { CLOCK_DIMENSION } from "./clock.constant";

export const polarToCartesianCoordinates = (
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const radians = (angleInDegrees * Math.PI) / 180;
  return {
    x: Math.round(radius * Math.cos(radians)),
    y: Math.round(radius * Math.sin(radians)),
  };
};
export const drawClockStructure = (
  ctx: CanvasRenderingContext2D,
  radius: number
) => {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
export const writeNumbers = (ctx: CanvasRenderingContext2D, radius: number) => {
  let startNum = 3;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    const { x, y } = polarToCartesianCoordinates(radius, i * 30);
    ctx.font = "18px Comic Sans MS";
    ctx.fillStyle = "red";
    const num = startNum + i;
    ctx.fillText(`${num > 12 ? num % 12 : num}`, x, y);
    ctx.closePath();
  }
};

export const drawHand = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  timePassed: number,
  isSecondHand: boolean
) => {
  const { x, y } = polarToCartesianCoordinates(
    CLOCK_DIMENSION.RADIUS - (isSecondHand ? 20 : 50),
    timePassed >= 15 ? (timePassed - 15) * 6 : 270 + timePassed * 6
  );

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);

  ctx.stroke();
};
export const drawHourHand = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  timePassed: number
) => {
  const { x, y } = polarToCartesianCoordinates(
    CLOCK_DIMENSION.RADIUS - 110,
    timePassed >= 3 ? (timePassed - 3) * 30 : 270 + timePassed * 30
  );

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);

  ctx.stroke();
};
