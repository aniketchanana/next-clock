import { useEffect, useRef, useState } from "react";
import { polarToCartesianCoordinates } from "../Clock/clock.utils";
import { getArcPath } from "./clockSvg.utils";

const RADIUS = 200;
const CENTER = {
  X: 200,
  Y: 200,
};
const ClockSvg = () => {
  const [date, setDate] = useState<Date>(new Date());
  const hour = date.getHours();
  const h = hour > 12 ? hour % 12 : hour;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const time = `${h}:${minute}:${second}`;

  useEffect(() => {
    let counter = 1;
    const intervalId = setInterval(() => {
      setDate(new Date(date.getTime() + counter * 1000));
      counter++;
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  const [hoursPassed, minutePassed, secondPassed] = time.split(":").map(Number);
  const { x: secondX, y: secondY } = polarToCartesianCoordinates(
    RADIUS - 30,
    secondPassed >= 15 ? (secondPassed - 15) * 6 : 270 + secondPassed * 6
  );
  const { x: minuteX, y: minuteY } = polarToCartesianCoordinates(
    RADIUS - 50,
    minutePassed >= 15 ? (minutePassed - 15) * 6 : 270 + minutePassed * 6
  );
  const { x: hourX, y: hourY } = polarToCartesianCoordinates(
    RADIUS - 60,
    hoursPassed >= 3 ? (hoursPassed - 3) * 30 : 270 + hoursPassed * 30
  );

  return (
    <div>
      <svg
        height="500"
        width="500"
        viewBox="0 0 500 500"
        style={{ border: "1px solid black" }}
      >
        <circle
          cx="250"
          cy="250"
          r="200"
          stroke="black"
          strokeWidth="1"
          fill="white"
        />
        <line
          x1={250}
          y1={250}
          x2={secondX + 250}
          y2={secondY + 250}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={250}
          y1={250}
          x2={minuteX + 250}
          y2={minuteY + 250}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={250}
          y1={250}
          x2={hourX + 250}
          y2={hourY + 250}
          stroke="black"
          strokeWidth="1"
        />
      </svg>
      <input
        placeholder="Enter time here"
        onBlur={(e) => {
          const date = new Date();

          setDate(
            new Date(
              `${date.getMonth() + 1} ${date.getUTCDate()} ${e.target.value}`
            )
          );
        }}
      />
    </div>
  );
};

export default ClockSvg;
