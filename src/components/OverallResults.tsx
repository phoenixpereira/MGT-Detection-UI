import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OverallResultsProps {
      machineGeneratedProbability: number | null;
      generatedText: string | null;
      model1Result: number | null;
      model2Result: number | null;
      model3Result: number | null;
}

const OverallResults: React.FunctionComponent<OverallResultsProps> = ({
      machineGeneratedProbability,
      generatedText,
      model1Result,
      model2Result,
      model3Result
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
                  <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-row">
                              <div>
                                    <div className="w-24 h-24 mx-auto">
                                          <CircularProgressbar
                                                value={machineGeneratedProbability || 0}
                                                text={`${machineGeneratedProbability ? machineGeneratedProbability.toFixed(2) : "0"}%`}
                                                styles={{
                                                      root: { width: "100%" },
                                                      path: {
                                                            stroke: getProgressBarColor(
                                                                  machineGeneratedProbability || 0
                                                            )
                                                      },
                                                      trail: { stroke: "gray-400" },
                                                      text: { fill: "black", fontSize: "14px" }
                                                }}
                                          />
                                    </div>
                                    <p className="text-center">Average</p>
                              </div>
                              <div className="px-4">
                                    <h1 className="text-lg font-semibold">
                                          Overall Machine Generated Probability
                                    </h1>
                                    <p className="mt-2">
                                          {generatedText ||
                                                "Please upload a file or enter text to analyse."}
                                    </p>
                              </div>
                        </div>
                        <div className="flex flex-row gap-4">
                              <h1 className="text-lg font-semibold">
                                    Individual Model Machine Generated Probability
                              </h1>
                              <div>
                                    <div className="w-24 h-24 mx-auto">
                                          <CircularProgressbar
                                                value={model1Result || 0}
                                                text={`${model1Result ? model1Result.toFixed(2) : "0"}%`}
                                                styles={{
                                                      root: { width: "100%" },
                                                      path: {
                                                            stroke: getProgressBarColor(
                                                                  model1Result || 0
                                                            )
                                                      },
                                                      trail: { stroke: "gray-400" },
                                                      text: { fill: "black", fontSize: "14px" }
                                                }}
                                          />
                                    </div>
                                    <p className="text-center">Model 1</p>
                              </div>
                              <div>
                                    <div className="w-24 h-24 mx-auto">
                                          <CircularProgressbar
                                                value={model2Result || 0}
                                                text={`${model2Result ? model2Result.toFixed(2) : "0"}%`}
                                                styles={{
                                                      root: { width: "100%" },
                                                      path: {
                                                            stroke: getProgressBarColor(
                                                                  model2Result || 0
                                                            )
                                                      },
                                                      trail: { stroke: "gray-400" },
                                                      text: { fill: "black", fontSize: "14px" }
                                                }}
                                          />
                                    </div>
                                    <p className="text-center">Model 2</p>
                              </div>
                              <div>
                                    <div className="w-24 h-24 mx-auto">
                                          <CircularProgressbar
                                                value={model3Result || 0}
                                                text={`${model3Result ? model3Result.toFixed(2) : "0"}%`}
                                                styles={{
                                                      root: { width: "100%" },
                                                      path: {
                                                            stroke: getProgressBarColor(
                                                                  model3Result || 0
                                                            )
                                                      },
                                                      trail: { stroke: "gray-400" },
                                                      text: { fill: "black", fontSize: "14px" }
                                                }}
                                          />
                                    </div>
                                    <p className="text-center">Model 3</p>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default OverallResults;
