import React, { useEffect, useRef, useState } from "react";
import { CANVAS_DIMENSION, CLOCK_DIMENSION } from "./clock.constant";
import { drawClockStructure, drawHand, drawHourHand } from "./clock.utils";

const Clock = () => {
  const clockRef = useRef<HTMLCanvasElement>(null);
  const currTime = useRef(new Date());
  const ctxRef = useRef<any>(null);
  const hour = currTime.current.getHours();
  const h = hour > 12 ? hour % 12 : hour;
  const minute = currTime.current.getMinutes();
  const second = currTime.current.getSeconds();
  const [time, setTime] = useState(
    `${h.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`
  );
  const updateTime = (time: string) => {
    const _time = time.split(":");
    if (_time.length < 3) {
      return;
    }
    const [hour, minute, second] = _time.map(Number);
    if (hour <= 0 || hour > 23) {
      return;
    } else if (minute > 60) {
      return;
    } else if (second > 60) {
      return;
    }
    setTime(time);
    const date = new Date();
    currTime.current = new Date(
      `${date.getMonth() + 1} ${date.getUTCDate()} ${time}`
    );
  };
  useEffect(() => {
    if (clockRef && clockRef.current) {
      const clock = clockRef.current;
      if (!clockRef || !clock) {
        return;
      }
      ctxRef.current = clock.getContext("2d");
      if (!ctxRef.current) {
        return;
      }
      const canvasCenterX = CANVAS_DIMENSION.WIDTH / 2;
      const canvasCenterY = CANVAS_DIMENSION.HEIGHT / 2;
      ctxRef.current.translate(canvasCenterX, canvasCenterY);
    }
  }, []);
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) {
      return;
    }
    drawClockStructure(ctx, CLOCK_DIMENSION.RADIUS);
    drawClockStructure(ctx, CLOCK_DIMENSION.RADIUS - 10);
    const [_hour, _minute, _second] = time.split(":").map(Number);
    drawHand(ctx, 0, 0, _second, true);
    drawHand(ctx, 0, 0, _minute, false);
    drawHourHand(ctx, 0, 0, _hour > 12 ? _hour % 12 : _hour);
  }, [time]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      currTime.current = new Date(currTime.current.getTime() + 1000);
      const hour = currTime.current.getHours();
      const h = hour > 12 ? hour % 12 : hour;
      const minute = currTime.current.getMinutes();
      const second = currTime.current.getSeconds();
      setTime(
        `${h.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:${second.toString().padStart(2, "0")}`
      );
    }, 1000);
    () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="flex items-center flex-col">
      <canvas
        ref={clockRef}
        height={CANVAS_DIMENSION.HEIGHT}
        width={CANVAS_DIMENSION.WIDTH}
        className="border border-black mb-3"
      ></canvas>
      <input
        placeholder={`${time} (Enter time)`}
        onBlur={(e) => updateTime(e.target.value)}
        className="w-full border"
      />
    </div>
  );
};

export default Clock;
