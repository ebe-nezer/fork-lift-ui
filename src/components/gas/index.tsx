/**
 * Gas component: Slider UI for fine throttle control between -100 and 100.
 * Calls onChange with the current value.
 */
import { Slider, styled } from "@mui/material";

type Props = {
  value: number;
  onChange(value: number): void;
};
export default function Gas({ value, onChange }: Props) {
  return (
    <Container>
      <Slider
        sx={{
          width: "100%",
        }}
        aria-label="Gas"
        value={value}
        min={-100}
        step={1}
        max={100}
        onFocus={() => onChange(33)}
        onTouchEnd={() => onChange(33)}
        onTouchCancel={() => onChange(33)}
        onPointerLeave={() => onChange(33)}
        onPointerCancel={() => onChange(33)}
        onPointerUp={() => onChange(33)}
        onChange={(_e, v) => onChange(v)}
      />
    </Container>
  );
}

const Container = styled("div")(
  ({
    theme: {
      breakpoints: { values },
    },
  }) => ({
    width: "100%",
    ".MuiSlider-root": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      width: "100%",
      height: "30px",
      boxSizing: "border-box",
      borderRadius: "8px",
      overflow: "hidden",
      maxWidth: Math.max(values.xs - 32, 340),
      ".MuiSlider-track": {
        borderRadius: "8px",
      },
      ".MuiSlider-thumb": {
        opacity: 0,
      },
    },
  })
);
