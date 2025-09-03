import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

type SpeedometerProps = {
  value: number;
  minValue?: number;
  maxValue?: number;
  segments?: number;
  needleColor?: string;
  startColor?: string;
  endColor?: string;
  height?: number;
  width?: number;
  currentValueText?: string;
};

const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  minValue = 0,
  maxValue = 60,
  needleColor = "#464A4F",
  startColor = "#00FF00",
  endColor = "#FF0000",
  currentValueText = "Speed: ${value}",
}) => {
  const segmentStep = 10;
  const segments = Math.ceil((maxValue - minValue) / segmentStep);
  const customSegmentStops = Array.from(
    { length: segments + 1 },
    (_, i) => minValue + i * segmentStep
  );
  // Ensure last stop is exactly maxValue
  if (customSegmentStops[customSegmentStops.length - 1] !== maxValue) {
    customSegmentStops[customSegmentStops.length - 1] = maxValue;
  }

  return (
    <ReactSpeedometer
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      customSegmentStops={customSegmentStops}
      labelFontSize="10"
      segments={segments}
      needleColor={needleColor}
      startColor={startColor}
      endColor={endColor}
      currentValueText={currentValueText}
    />
  );
};

export default Speedometer;
