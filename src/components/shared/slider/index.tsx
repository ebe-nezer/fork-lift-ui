import { Slider, styled } from "@mui/material";

export const PrettoSlider = styled(Slider)<{
  labelPlacement?: "top" | "bottom" | "right" | "left";
}>(
  ({
    labelPlacement = "top",
    theme: {
      breakpoints: { values },
    },
  }) => {
    let valueLabelStyles = {};

    switch (labelPlacement) {
      case "bottom":
        valueLabelStyles = {
          transformOrigin: "top left",
          transform: "translate(50%, 100%) rotate(45deg) scale(0)",
          "&.MuiSlider-valueLabelOpen": {
            transform: "translate(50%, 100%) rotate(45deg) scale(1)",
          },
          "& > *": {
            transform: "rotate(-45deg)",
          },
        };
        break;
      case "right":
        valueLabelStyles = {
          transformOrigin: "top left",
          transform: "translate(100%, -62%) rotate(45deg) scale(0)",
          "&.MuiSlider-valueLabelOpen": {
            transform: "translate(280%, -62%) rotate(45deg) scale(1)",
          },
          "& > *": {
            transform: "rotate(-45deg)",
          },
        };
        break;
      case "left":
        valueLabelStyles = {
          transformOrigin: "top right",
          transform: "translate(-100%, 0%) rotate(-45deg) scale(0)",
          "&.MuiSlider-valueLabelOpen": {
            transform: "translate(-100%, 0%) rotate(-45deg) scale(1)",
          },
          "& > *": {
            transform: "rotate(45deg)",
          },
        };
        break;
      case "top":
      default:
        valueLabelStyles = {
          transformOrigin: "bottom left",
          transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
          "&.MuiSlider-valueLabelOpen": {
            transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
          },
          "& > *": {
            transform: "rotate(45deg)",
          },
        };
        break;
    }

    return {
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
        ...valueLabelStyles,
        "&::before": { display: "none" },
      },
    };
  }
);
