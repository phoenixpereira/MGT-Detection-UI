import React from "react";
import CircularProgressBar from "./CircularProgressBar";
import Tooltip from "./Tooltip";

interface ModelResultsProps {
  machineGeneratedProbability: number | null;
  generatedText: string | null;
  model1Result: number | null;
  model2Result: number | null;
  model3Result: number | null;
}

const ModelResults: React.FunctionComponent<ModelResultsProps> = ({
  machineGeneratedProbability,
  generatedText,
  model1Result,
  model2Result,
  model3Result,
}) => {
  machineGeneratedProbability =
    ((model1Result ?? 0) + (model2Result ?? 0) + (model3Result ?? 0)) / 3;

  return (
    <div className="flex border border-gray-300 p-4 rounded-md shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-row py-4 lg:py-0 border-b border-r-0 lg:border-r lg:border-b-0 border-gray-300 relative pr-2">
          <div>
            <div className="mx-auto">
              <CircularProgressBar
                percentage={machineGeneratedProbability}
                radius={55}
              ></CircularProgressBar>
            </div>
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
          <Tooltip info="The probability score is calculated as the average of individual model scores, with each model weighted equally." />
        </div>
        <div className="flex flex-col lg:flex-row">
          <h1 className="text-lg font-semibold">
            Individual Model Machine Generated Probability
          </h1>
          <div className="mt-2 lg:mt-0 flex flex-row gap-4">
            <div>
              <div className="mx-auto">
                <CircularProgressBar
                  percentage={model1Result}
                  radius={45}
                ></CircularProgressBar>
              </div>
              <p className="text-center">Model 1</p>
            </div>
            <div>
              <div className="mx-auto">
                <CircularProgressBar
                  percentage={model2Result}
                  radius={45}
                ></CircularProgressBar>
              </div>
              <p className="text-center">Model 2</p>
            </div>
            <div>
              <div className="mx-auto">
                <CircularProgressBar
                  percentage={model3Result}
                  radius={45}
                ></CircularProgressBar>
              </div>
              <p className="text-center">Model 3</p>
            </div>
            <Tooltip info="This score represents the probability that the text is machine-generated, as assessed by each individual model." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelResults;
