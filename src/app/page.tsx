"use client";

import "@/lib/env";
import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ModelResults from "@/components/ModelResults";
import HighlightedText from "@/components/HighlightedText";
import Statistics from "@/components/Statistics";

export default function Home() {
  const [overallResult, setOverallResult] = useState<{
    machineGeneratedProbability: number | null;
    generatedText: string | null;
    highlightedChunks: any[];
    textChunks: any[];
  }>({
    machineGeneratedProbability: null,
    generatedText: null,
    highlightedChunks: [],
    textChunks: [],
  });

  const [model1Result, setModel1Result] = useState<number | null>(null);
  const [model2Result, setModel2Result] = useState<number | null>(null);
  const [model3Result, setModel3Result] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-8">
      <div className="border border-gray-300 p-4 lg:p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Machine Generated Text (MGT) Detector
        </h1>
        <p>
          This is a MGT detector that uses multiple existing MGT detection
          models and text statistics to more accurately determine if text is
          machine-generated or not.
        </p>
        {!isSubmitted && (
          <p className="mt-2">
            Start by selecting a PDF or manually entering text.
          </p>
        )}

        {overallResult.generatedText && isSubmitted && (
          <button
            onClick={handleReload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Start again
          </button>
        )}

        {!overallResult.generatedText && isSubmitted && (
          <p className="font-bold mt-2">
            Please wait, the text is being analysed...
          </p>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {isSubmitted && (
          <ModelResults
            machineGeneratedProbability={
              overallResult.machineGeneratedProbability
            }
            generatedText={overallResult.generatedText}
            model1Result={model1Result}
            model2Result={model2Result}
            model3Result={model3Result}
          />
        )}

        <FileUpload
          setOverallResult={setOverallResult}
          setModel1Result={setModel1Result}
          setModel2Result={setModel2Result}
          setModel3Result={setModel3Result}
          highlightedChunks={overallResult.highlightedChunks}
          textChunks={overallResult.textChunks}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
        />

        {/* Render Statistics component if generated text is available */}
        {overallResult.generatedText && (
          <Statistics userText={overallResult.textChunks.join(" ")} />
        )}

        {/* Render HighlightedText component if highlighted chunks are available */}
        {overallResult.highlightedChunks.length > 0 && (
          <HighlightedText
            textChunks={overallResult.textChunks}
            highlightedChunks={overallResult.highlightedChunks}
          />
        )}
      </div>
    </div>
  );
}
