/**
 * Throttle component: Provides interactive accelerator and brake controls for throttle value.
 * - Accelerator: Hold to increase throttle (0 to 100).
 * - Brake: Tap for instant stop, hold for 2s to reverse (0 to -100).
 * - Throttle returns to 0 when released.
 * Calls onChange with the current throttle value.
 */
import { styled } from "@mui/material";
import Accelerator from "../../assets/accelerate.png";
import { useState, useEffect, useRef } from "react";

type Props = {
  onChange(angle: number): void;
};
export default function Throttle({ onChange }: Props) {
  const throttle = useRef(0);
  const [isHoldingForward, setIsHoldingForward] = useState(false);
  const [isHoldingBackward, setIsHoldingBackward] = useState(false);
  const [brakeActive, setBrakeActive] = useState(false); // true if brake held >=2s
  const brakeTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Effect for throttle logic
  useEffect(() => {
    if (
      (isHoldingForward && isHoldingBackward) ||
      (!isHoldingForward && !isHoldingBackward && !brakeActive)
    ) {
      // Both held or none held: brake to zero
      throttle.current = 0;
      onChange(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isHoldingForward) {
      intervalRef.current = window.setInterval(() => {
        throttle.current = Math.min(throttle.current + 1, 100);
        onChange(throttle.current);
      }, 10);
    } else if (isHoldingBackward || brakeActive) {
      intervalRef.current = window.setInterval(() => {
        throttle.current = Math.max(throttle.current - 1, -100);
        onChange(throttle.current);
      }, 10);
    } else {
      // Decay to zero when released
      intervalRef.current = window.setInterval(() => {
        // setThrottle((prev) => {
        //   if (prev === 0) return 0;
        //   const newThrottle =
        //     prev > 0 ? Math.max(prev - 2, 0) : Math.min(prev + 2, 0);
        //   onChange(newThrottle);
        //   return newThrottle;
        // });
        throttle.current = Math.max(throttle.current - 2, 0);
        onChange(throttle.current);
      }, 10);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHoldingForward, isHoldingBackward, brakeActive, onChange]);

  // Forward throttle handlers
  const handleForwardDown = () => {
    if (isHoldingBackward) {
      // If back throttle is held, act as brake
      throttle.current = 0;
      onChange(0);
      setIsHoldingForward(false);
      setIsHoldingBackward(false);
      setBrakeActive(false);
      return;
    }
    setIsHoldingForward(true);
  };
  const handleForwardUp = () => setIsHoldingForward(false);

  // Backward throttle handlers
  const handleBackwardDown = () => {
    if (isHoldingForward) {
      // If forward throttle is held, act as brake
      throttle.current = 0;
      onChange(0);
      setIsHoldingForward(false);
      setIsHoldingBackward(false);
      setBrakeActive(false);
      return;
    }
    setIsHoldingBackward(true);
    // Optionally, you can keep the 2s brake logic if needed
    brakeTimerRef.current = window.setTimeout(() => {
      setBrakeActive(true);
    }, 2000);
  };
  const handleBackwardUp = () => {
    setIsHoldingBackward(false);
    setBrakeActive(false);
    if (brakeTimerRef.current) {
      clearTimeout(brakeTimerRef.current);
      brakeTimerRef.current = null;
    }
  };

  return (
    <Container>
      <div
        className="wrapper"
        onPointerDown={handleForwardDown}
        onPointerCancel={handleForwardUp}
        onPointerUp={handleForwardUp}
        onPointerLeave={handleForwardUp}
      >
        <img src={Accelerator} alt="Accelerator" id="accelerator" />
      </div>
      <div
        className="wrapper"
        onPointerDown={handleBackwardDown}
        onPointerCancel={handleBackwardUp}
        onPointerUp={handleBackwardUp}
        onPointerLeave={handleBackwardUp}
      >
        <img src={Accelerator} alt="Break" id="break" />
      </div>
    </Container>
  );
}

const Container = styled("div")({
  width: "max-content",
  height: "max-content",
  gap: "12px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto auto",
  "& .wrapper": {
    width: "max-content",
    height: "max-content",
    userSelect: "none",
    "&:active": {
      transform: "scale(0.95)",
    },
    transition: "all .2s",
  },
  "& img": {
    width: "80px",
    height: "auto",
    pointerEvents: "none",
  },
  "#break": {
    transform: "rotate(180deg)",
  },
});
