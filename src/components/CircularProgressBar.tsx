import React from "react";

const getProgressBarColour = (percentage: number | null) => {
  if (percentage === null) return "#d3d3d3"; // Default color for null probability
  if (percentage <= 10) return "#43aa8b";
  if (percentage <= 25) return "#90be6d";
  if (percentage <= 40) return "#f9c74f";
  if (percentage <= 60) return "#f8961e";
  if (percentage <= 75) return "#f3722c";
  return "#f94144";
};

const CircularProgressBar = ({
  percentage,
  radius,
}: {
  percentage: number | null;
  radius: number;
}) => {
  const value = percentage || 0;
  const displayValue = value.toFixed(2);
  const circleColour = getProgressBarColour(value);

  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          strokeWidth="10"
          stroke="#d3d3d3"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={`${circleColour}`}
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <span className="absolute text-black text-sm font-medium">{`${displayValue}%`}</span>
    </div>
  );
};

export default CircularProgressBar;
