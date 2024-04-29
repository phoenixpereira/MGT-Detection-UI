import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OverallResultsProps {
  machineGeneratedProbability: number | null;
  generatedText: string | null;
}

const OverallResults: React.FunctionComponent<OverallResultsProps> = ({
  machineGeneratedProbability,
  generatedText,
}) => {
  const getProgressBarColor = (percentage: number): string => {
    if (percentage === null) return "gray-400"; // Default colour for null probability
    if (percentage <= 10) {
      return "red-500";
    } else if (percentage <= 25) {
      return "orange-500";
    } else if (percentage <= 40) {
      return "orange-700";
    } else {
      return "green-500";
    }
  };

  return (
    <div className="flex mt-4">
      <div className="w-1/2">
        <div className="w-32 h-32 mx-auto">
          <CircularProgressbar
            value={machineGeneratedProbability || 0}
            text={`${machineGeneratedProbability ? machineGeneratedProbability.toFixed(2) : "0"}%`}
            styles={{
              root: { width: "100%" },
              path: {
                stroke: getProgressBarColor(machineGeneratedProbability || 0),
              },
              trail: { stroke: "gray-400" },
              text: { fill: "black", fontSize: "20px" },
            }}
          />
        </div>
      </div>
      <div className="w-1/2 px-4">
        <h1 className="text-lg font-semibold">Overall Results</h1>
        <p className="mt-2">
          {generatedText || "Please upload a file or enter text to analyse."}
        </p>
      </div>
    </div>
  );
};

export default OverallResults;
