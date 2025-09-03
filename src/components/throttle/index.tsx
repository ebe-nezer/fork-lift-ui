import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { PrettoSlider } from "../shared/slider";
import Break from "../../assets/break.png";

type Props = {
  onChange(value: number): void;
  value: number;
  min?: number;
  max?: number;
};

/**
 * Throttle component: Vertical slider for throttle value (0 to 50).
 * Calls onChange with the current value.
 */
export default function Throttle({
  onChange,
  value,
  min = 0,
  max = 50,
}: Props) {
  const [isHoldingAccelerator, setIsHoldingAccelerator] = useState(false);
  const [holdingTimer, setHoldingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [isHoldingBreak, setIsHoldingBreak] = useState(false);

  const handleMouseUp = () => {
    setIsHoldingAccelerator(false);
    if (holdingTimer) {
      window.clearTimeout(holdingTimer);
      setHoldingTimer(null);
    }
  };

  const handleBreakUp = () => {
    setIsHoldingBreak(false);
  };

  useEffect(() => {
    if (isHoldingBreak) {
      setTimeout(() => {
        if (value > -20) {
          onChange(Math.max(value - 1, -20));
        }
      }, 10);
    }
  }, [isHoldingBreak, onChange, value]);

  // In the second useEffect (for auto decrease)
  useEffect(() => {
    const decreaseThrottle = () => {
      if (isHoldingBreak) {
        if (value > -20) {
          onChange(Math.max(value - 1, -20));
        }
      } else {
        if (value > 0) {
          onChange(value - 1);
        } else if (value < 0) {
          // Gradually return from -20 to 0 in small steps
          onChange(Math.min(value + 0.2, 0));
        }
      }
    };

    if (isHoldingAccelerator || isHoldingBreak) return;

    // Use slower interval for negative to zero
    const interval = value < 0 ? 10 : 10;
    const time = setTimeout(decreaseThrottle, interval);

    return () => {
      if (isHoldingAccelerator) return;
      window.clearTimeout(time);
      setHoldingTimer(null);
    };
  }, [isHoldingAccelerator, onChange, value, holdingTimer, isHoldingBreak]);

  return (
    <Container>
      <div className="wrapper">
        <PrettoSlider
          aria-label="ForkLiftDirection"
          value={value}
          min={min}
          step={1}
          max={max}
          labelPlacement="right"
          orientation="vertical"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
          onPointerLeave={handleMouseUp}
          onPointerCancel={handleMouseUp}
          onPointerUp={handleMouseUp}
          onChange={(_e, v) => {
            setIsHoldingAccelerator(true);
            onChange(v as number);
          }}
        />
      </div>
      <div
        className="wrapper"
        onTouchEnd={handleBreakUp}
        onTouchCancel={handleBreakUp}
        onPointerLeave={handleBreakUp}
        onPointerCancel={handleBreakUp}
        onPointerUp={handleBreakUp}
        onClick={() => {
          onChange(0);
        }}
        onPointerDown={() => {
          setIsHoldingBreak(true);
        }}
      >
        <img src={Break} alt={"Break"} id={"break"} />
      </div>
    </Container>
  );
}

const Container = styled("div")({
  width: "max-content",
  height: "max-content",
  gap: "12px",
  display: "grid",
  gridTemplateColumns: "auto auto",
  gridTemplateRows: "auto",
  alignItems: "end",
  ".MuiSlider-root": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minHeight: "200px",
    width: "40px",
    boxSizing: "border-box",
    borderRadius: "8px",
    ".MuiSlider-track": {
      borderRadius: "8px",
    },
    ".MuiSlider-thumb": {
      width: "100%",
      height: "17px",
      borderRadius: "8px",
    },
    "& *": {
      transition: "all .3s",
      animationDuration: "300ms",
    },
  },
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
  "& #break": {
    height: "80px",
    objectFit: "contain",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 2px 8px #0002",
    },
  },
});
