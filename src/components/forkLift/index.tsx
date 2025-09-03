/**
 * ForkLiftDirection component: Slider UI for fine throttle control between -100 and 100.
 * Calls onChange with the current value.
 */
import { Slider, styled } from "@mui/material";

type Props = {
  value: number;
  onChange(value: number): void;
};

const PrettoSlider = styled(Slider)(
  ({
    theme: {
      breakpoints: { values },
    },
  }) => ({
    color: "#52af77",
    height: "34px",
    maxWidth: Math.max(values.xs - 32, 340),
    "& .MuiSlider-track": {
      border: "none",
      borderRadius: "8px 0px 0px 8px",
    },
    "& .MuiSlider-thumb": {
      height: "34px",
      width: "17px",
      borderRadius: "8px",
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&::before": {
        display: "none",
      },
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#52af77",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&::before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
        transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
      },
      "& > *": {
        transform: "rotate(45deg)",
      },
    },
  })
);

export default function ForkLiftDirection({ value, onChange }: Props) {
  return (
    <Container>
      <PrettoSlider
        aria-label="ForkLiftDirection"
        value={value}
        min={-100}
        step={1}
        max={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}`}
        onTouchEnd={() => onChange(33)}
        onTouchCancel={() => onChange(33)}
        onPointerLeave={() => onChange(33)}
        onPointerCancel={() => onChange(33)}
        onPointerUp={() => onChange(33)}
        onChange={(_e, v) => onChange(v as number)}
      />
    </Container>
  );
}

const Container = styled("div")({
  width: "100%",
});
