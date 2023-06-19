import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTheta, polarToCartesianCoordinates } from "../Clock/clock.utils";
import clockStyles from "./clock.module.css";
const RADIUS = 200;
const CENTER = {
  X: 250,
  Y: 250,
};

enum HAND_NAME {
  HOUR = "HOUR",
  MINUTE = "MINUTE",
  SECOND = "SECOND",
}
const DELTA = 250;
const HANDLE_RADIUS = 10;
const ClockSvg = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [changeHandlePosition, setChangeHandlePosition] = useState<any>(null);

  const svgElement = useRef<any>(null);
  const selectedHandRef = useRef<string>("");

  const hoursPassed = useMemo(() => {
    const hour = date.getHours();
    const h = hour > 12 ? hour % 12 : hour || 12;
    return Number(h);
  }, [date]);
  const minutePassed = Number(date.getMinutes());
  const secondPassed = Number(date.getSeconds());

  const { minuteHandEndX, minuteHandEndY } = useMemo(() => {
    const { x: minuteX, y: minuteY } = polarToCartesianCoordinates(
      RADIUS - 50,
      minutePassed >= 15 ? (minutePassed - 15) * 6 : 270 + minutePassed * 6,
      DELTA
    );
    const minuteHandEndX =
      selectedHandRef.current === HAND_NAME.MINUTE && changeHandlePosition
        ? changeHandlePosition.x
        : minuteX;
    const minuteHandEndY =
      selectedHandRef.current === HAND_NAME.MINUTE && changeHandlePosition
        ? changeHandlePosition.y
        : minuteY;
    return {
      minuteHandEndY,
      minuteHandEndX,
    };
  }, [changeHandlePosition, minutePassed]);

  const { secondHandEndX, secondHandEndY } = useMemo(() => {
    const { x: secondX, y: secondY } = polarToCartesianCoordinates(
      RADIUS - 30,
      secondPassed >= 15 ? (secondPassed - 15) * 6 : 270 + secondPassed * 6,
      DELTA
    );
    const secondHandEndX =
      selectedHandRef.current === HAND_NAME.SECOND && changeHandlePosition
        ? changeHandlePosition.x
        : secondX;
    const secondHandEndY =
      selectedHandRef.current === HAND_NAME.SECOND && changeHandlePosition
        ? changeHandlePosition.y
        : secondY;
    return {
      secondHandEndX,
      secondHandEndY,
    };
  }, [changeHandlePosition, secondPassed]);

  const { hourHandEndX, hourHandEndY } = useMemo(() => {
    const { x: hourX, y: hourY } = polarToCartesianCoordinates(
      RADIUS - 80,
      hoursPassed >= 3 ? (hoursPassed - 3) * 30 : 270 + hoursPassed * 30,
      DELTA
    );
    const hourHandEndX =
      selectedHandRef.current === HAND_NAME.HOUR && changeHandlePosition
        ? changeHandlePosition.x
        : hourX;
    const hourHandEndY =
      selectedHandRef.current === HAND_NAME.HOUR && changeHandlePosition
        ? changeHandlePosition.y
        : hourY;

    return {
      hourHandEndX,
      hourHandEndY,
    };
  }, [changeHandlePosition, hoursPassed]);

  const getCursorPosition = (e: any) => {
    const box = svgElement.current.getBoundingClientRect();
    return { clientX: e.pageX - box.x, clientY: e.pageY - box.y };
  };

  const onTimeChangeStart = (e: any, selectedHand: HAND_NAME) => {
    e.target.style.cursor = "grabbing";
    selectedHandRef.current = selectedHand;
  };

  const onTimeChangeEnd = (e: any) => {
    const { clientX, clientY } = getCursorPosition(e);
    const thetaInDeg = getTheta(CENTER.X, CENTER.Y, 450, 250, clientX, clientY);
    const date = new Date();
    let updatedHours = hoursPassed;
    let updateMinutes = minutePassed;
    let updatedSeconds = secondPassed;
    if (selectedHandRef.current === HAND_NAME.HOUR) {
      updatedHours = Math.round((thetaInDeg / 30 + 3) % 12);
      updatedHours = updatedHours === 0 ? 12 : updatedHours;
    } else if (selectedHandRef.current === HAND_NAME.MINUTE) {
      updateMinutes = Math.round((thetaInDeg / 6 + 15) % 60);
      updateMinutes = updateMinutes === 0 ? 60 : updateMinutes;
    } else if (selectedHandRef.current === HAND_NAME.SECOND) {
      updatedSeconds = Math.round((thetaInDeg / 6 + 15) % 60);
      updatedSeconds = updatedSeconds === 0 ? 60 : updatedSeconds;
    }
    setDate(
      new Date(
        `${date.getMonth() + 1} ${date.getUTCDate()} ${Math.round(
          updatedHours
        )}:${updateMinutes}:${updatedSeconds}`
      )
    );
    e.target.style.cursor = "grab";
    selectedHandRef.current = "";
    setChangeHandlePosition(null);
  };

  const updateHandlePosition = useCallback((e: any) => {
    if (!selectedHandRef.current) {
      return;
    }

    const { clientX, clientY } = getCursorPosition(e);
    setChangeHandlePosition({
      x: clientX,
      y: clientY,
    });
  }, []);

  const getClockHand = (type: HAND_NAME) => {
    const getCoords = () => {
      if (type === HAND_NAME.SECOND) {
        return [secondHandEndX, secondHandEndY];
      } else if (type === HAND_NAME.MINUTE) {
        return [minuteHandEndX, minuteHandEndY];
      }
      return [hourHandEndX, hourHandEndY];
    };
    const [endX, endY] = getCoords();
    return (
      <g>
        <line
          x1={CENTER.X}
          y1={CENTER.Y}
          x2={endX}
          y2={endY}
          className={clockStyles.clockHand}
        />
        <circle
          cx={endX}
          cy={endY}
          r={HANDLE_RADIUS}
          stroke="white"
          strokeWidth="2"
          className={clockStyles.changeHandle}
          onMouseDown={(e: any) => onTimeChangeStart(e, type)}
          onMouseUp={onTimeChangeEnd}
          onMouseMove={updateHandlePosition}
        />
      </g>
    );
  };

  const getTime = () => {
    return `${hoursPassed.toString().padStart(2, "0")}:${minutePassed
      .toString()
      .padStart(2, "0")}:${secondPassed.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    if (selectedHandRef.current) {
      return;
    }
    let counter = 1;
    const intervalId = setInterval(() => {
      setDate(new Date(date.getTime() + counter * 1000));
      counter++;
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, selectedHandRef.current]);

  useEffect(() => {
    window.addEventListener("mousemove", updateHandlePosition);
    return () => window.removeEventListener("mousemove", updateHandlePosition);
  }, [updateHandlePosition]);

  const time = getTime();
  return (
    <div>
      <svg
        ref={svgElement}
        height="500"
        width="500"
        viewBox="0 0 500 500"
        style={{ border: "1px solid black" }}
      >
        <circle
          cx={CENTER.X}
          cy={CENTER.Y}
          r={RADIUS}
          stroke="black"
          strokeWidth="1"
          fill="white"
        />
        {getClockHand(HAND_NAME.HOUR)}
        {getClockHand(HAND_NAME.MINUTE)}
        {getClockHand(HAND_NAME.SECOND)}
      </svg>
      <input
        placeholder={`Enter time here ${time}`}
        className="w-full mt-4"
        onBlur={(e) => {
          if (!e.target.value) return;
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
