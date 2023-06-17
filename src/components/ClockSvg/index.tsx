import { useEffect, useMemo, useRef, useState } from "react";
import { getTheta, polarToCartesianCoordinates } from "../Clock/clock.utils";
import { getArcPath } from "./clockSvg.utils";
import clockStyles from "./clock.module.css";
import { time } from "console";
const RADIUS = 200;
const CENTER = {
  X: 250,
  Y: 250,
};
type ChangeHandle = null | {
  x: number;
  y: number;
};
enum HAND_NAME {
  HOUR = "HOUR",
  MINUTE = "MINUTE",
  SECOND = "SECOND",
}
const DELTA = 250;
const ClockSvg = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [changeHandlePosition, setChangeHandlePosition] =
    useState<ChangeHandle>(null);
  const hoveredHand = useRef<string>("");
  const svgElement = useRef<any>(null);
  const selectedHandRef = useRef<string>("");
  const selectedHand = selectedHandRef.current;
  const { hoursPassed, minutePassed, secondPassed } = useMemo(() => {
    const hour = date.getHours();
    const h = hour > 12 ? hour % 12 : hour;
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const time = `${h}:${minute}:${second}`;
    return {
      time,
      hoursPassed: Number(h),
      minutePassed: Number(minute),
      secondPassed: Number(second),
    };
  }, [date]);

  function getCursorPosition(e: any) {
    const box = svgElement.current.getBoundingClientRect();
    return { clientX: e.pageX - box.x, clientY: e.pageY - box.y };
  }
  const onTimeChangeStart = (e: any) => {
    e.target.style.cursor = "grabbing";
    selectedHandRef.current = hoveredHand.current;
  };
  const onTimeChangeEnd = (e: any) => {
    const { clientX, clientY } = getCursorPosition(e);
    const thetaInDeg = getTheta(CENTER.X, CENTER.Y, 450, 250, clientX, clientY);
    const date = new Date();
    let updatedHours = hoursPassed;
    let updateMinutes = minutePassed;
    let updatedSeconds = secondPassed;
    if (selectedHand === HAND_NAME.HOUR) {
      updatedHours = Math.round((thetaInDeg / 30 + 3) % 12);
    } else if (selectedHand === HAND_NAME.MINUTE) {
      updateMinutes = Math.round((thetaInDeg / 6 + 15) % 60);
    } else if (selectedHand === HAND_NAME.SECOND) {
      updatedSeconds = Math.round((thetaInDeg / 6 + 15) % 60);
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
  const updateHandlePosition = (e: any) => {
    if (!selectedHand) {
      return;
    }

    const { clientX, clientY } = getCursorPosition(e);
    setChangeHandlePosition({
      x: clientX,
      y: clientY,
    });
  };
  const handleTimeSetting = (_hoveredHand: HAND_NAME) => {
    if (!!selectedHand) {
      return;
    }
    if (selectedHand === HAND_NAME.HOUR) {
      setChangeHandlePosition({ x: hourX, y: hourY });
    } else if (selectedHand === HAND_NAME.MINUTE) {
      setChangeHandlePosition({ x: minuteX, y: minuteY });
    } else if (selectedHand === HAND_NAME.SECOND) {
      setChangeHandlePosition({ x: secondX, y: secondY });
    }
    hoveredHand.current = _hoveredHand;
  };

  useEffect(() => {
    if (selectedHand) {
      return;
    }
    let counter = 1;
    const intervalId = setInterval(() => {
      setDate(new Date(date.getTime() + counter * 1000));
      counter++;
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, selectedHand]);

  const { x: secondX, y: secondY } = polarToCartesianCoordinates(
    RADIUS - 30,
    secondPassed >= 15 ? (secondPassed - 15) * 6 : 270 + secondPassed * 6,
    DELTA
  );
  const { x: minuteX, y: minuteY } = polarToCartesianCoordinates(
    RADIUS - 50,
    minutePassed >= 15 ? (minutePassed - 15) * 6 : 270 + minutePassed * 6,
    DELTA
  );
  const { x: hourX, y: hourY } = polarToCartesianCoordinates(
    RADIUS - 60,
    hoursPassed >= 3 ? (hoursPassed - 3) * 30 : 270 + hoursPassed * 30,
    DELTA
  );

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
        <line
          x1={CENTER.X}
          y1={CENTER.Y}
          x2={
            selectedHand === HAND_NAME.SECOND && changeHandlePosition
              ? changeHandlePosition.x
              : secondX
          }
          y2={
            selectedHand === HAND_NAME.SECOND && changeHandlePosition
              ? changeHandlePosition.y
              : secondY
          }
          stroke="black"
          strokeWidth="1"
          className={clockStyles.clockHand}
          onMouseEnter={() => handleTimeSetting(HAND_NAME.SECOND)}
        />
        <line
          x1={CENTER.X}
          y1={CENTER.Y}
          x2={
            selectedHand === HAND_NAME.MINUTE && changeHandlePosition
              ? changeHandlePosition.x
              : minuteX
          }
          y2={
            selectedHand === HAND_NAME.MINUTE && changeHandlePosition
              ? changeHandlePosition.y
              : minuteY
          }
          stroke="black"
          strokeWidth="1"
          className={clockStyles.clockHand}
          onMouseEnter={() => handleTimeSetting(HAND_NAME.MINUTE)}
        />
        <line
          x1={CENTER.X}
          y1={CENTER.Y}
          x2={
            selectedHand === HAND_NAME.HOUR && changeHandlePosition
              ? changeHandlePosition.x
              : hourX
          }
          y2={
            selectedHand === HAND_NAME.HOUR && changeHandlePosition
              ? changeHandlePosition.y
              : hourY
          }
          className={clockStyles.clockHand}
          onMouseEnter={() => handleTimeSetting(HAND_NAME.HOUR)}
        />
        {changeHandlePosition && selectedHand && (
          <circle
            cx={changeHandlePosition.x}
            cy={changeHandlePosition.y}
            r={10}
            stroke="white"
            strokeWidth="2"
            className={clockStyles.changeHandle}
            onMouseDown={onTimeChangeStart}
            onMouseUp={onTimeChangeEnd}
            onMouseMove={updateHandlePosition}
          />
        )}
      </svg>
      <input
        placeholder={`Enter time here ${hoursPassed}:${minutePassed}:${secondPassed}`}
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
