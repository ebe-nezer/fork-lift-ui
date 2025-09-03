/**
 * SteeringWheel component: Interactive steering wheel using a PNG image and canvas.
 * - User can grab and rotate the wheel (with inertia return to center).
 * - Angle is clamped between min and max (default -60 to 60 degrees).
 * - Calls onChange with the current angle.
 */
import React, { useRef, useEffect, useState } from "react";
import SWImage from "../../assets/steering-wheel.png";

const CANVAS_SIZE = 200;

type Props = {
  onChange(angle: number): void;
  min?: number;
  max?: number;
};
const SteeringWheel = ({ onChange, min = -60, max = 60 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0); // -min to +max
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inertiaRef = useRef<number | null>(null);
  // Store grab info for realistic rotation
  const grabInfo = useRef<{
    startPointerAngle: number;
    startWheelAngle: number;
  } | null>(null);

  // Load the image only once
  useEffect(() => {
    const img = new window.Image();
    img.src = SWImage;
    img.onload = () => {
      imgRef.current = img;
      drawWheel(angle);
    };
  }, []);

  // Redraw when angle changes
  useEffect(() => {
    if (angle === 0) return;
    drawWheel(angle);
  }, [angle]);

  const drawWheel = (a: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.save();
    ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.rotate((a * Math.PI) / 180);
    ctx.drawImage(
      img,
      -CANVAS_SIZE / 2,
      -CANVAS_SIZE / 2,
      CANVAS_SIZE,
      CANVAS_SIZE
    );
    ctx.restore();
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const radius = CANVAS_SIZE / 2;
    if (x * x + y * y <= radius * radius) {
      setDragging(true);
      // Store the initial pointer angle and wheel angle
      grabInfo.current = {
        startPointerAngle: Math.atan2(y, x) * (180 / Math.PI),
        startWheelAngle: angle,
      };
      // Stop inertia if user grabs wheel
      if (inertiaRef.current) {
        cancelAnimationFrame(inertiaRef.current);
        inertiaRef.current = null;
      }
    }
  };
  const handlePointerUp = () => {
    setDragging(false);
    grabInfo.current = null;
    // Start inertia (return to center) if not centered
    if (angle !== 0) {
      animateReturnToCenter();
    }
  };
  const handlePointerLeave = () => {
    setDragging(false);
    grabInfo.current = null;
    if (angle !== 0) {
      animateReturnToCenter();
    }
  };
  // Inertia: smoothly return to center
  const animateReturnToCenter = () => {
    const step = () => {
      setAngle((prev) => {
        // Use exponential decay for smoothness
        const next = prev * 0.85;
        if (Math.abs(next) < 0.5) {
          return 0;
        }
        return next;
      });
      inertiaRef.current = requestAnimationFrame(() => {
        if (Math.abs(angle) > 0.5) step();
      });
    };
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
    step();
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging || !grabInfo.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const pointerAngle = Math.atan2(y, x) * (180 / Math.PI);
    // Calculate the difference from the initial grab
    let delta = pointerAngle - grabInfo.current.startPointerAngle;
    // Normalize delta to [-180, 180]
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    let newAngle = grabInfo.current.startWheelAngle + delta;
    // Clamp angle
    newAngle = Math.max(min, Math.min(max, newAngle));
    console.log(
      "PointerMove: pointerAngle",
      pointerAngle,
      "delta",
      delta,
      "newAngle",
      newAngle
    );
    setAngle(newAngle);
    console.log("[SteeringWheel] onChange called with:", newAngle);
    onChange(newAngle);
    // Stop inertia if user is dragging
    if (inertiaRef.current) {
      console.log("PointerMove: cancel inertia");
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        borderRadius: "50%",
        userSelect: "none",
        touchAction: "none",
        background: "#f5f5f5",
        boxShadow: "0 2px 8px #0002",
        cursor: dragging ? "grabbing" : "grab",
        display: "block",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    />
  );
};

export default SteeringWheel;
