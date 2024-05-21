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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">MGT Detector</h1>
      <div className="grid grid-cols-1 gap-4">
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
        {overallResult.generatedText && (
          <Statistics textChunks={overallResult.textChunks}></Statistics>
        )}

        {overallResult.generatedText && (
          <HighlightedText
            textChunks={overallResult.textChunks}
            highlightedChunks={overallResult.highlightedChunks}
          />
        )}
      </div>
    </div>
  );
}
