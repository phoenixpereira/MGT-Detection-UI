"use client";

import "@/lib/env";
import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import OverallResults from "@/components/OverallResults";
import HighlightedText from "@/components/HighlightedText";

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">MGT Detector</h1>
      <div className="grid grid-cols-1 gap-4">
        <OverallResults
          machineGeneratedProbability={
            overallResult.machineGeneratedProbability
          }
          generatedText={overallResult.generatedText}
        />
        <FileUpload
          setOverallResult={setOverallResult}
          highlightedChunks={overallResult.highlightedChunks} // Passing highlightedChunks to FileUpload
          textChunks={overallResult.textChunks}
        />
        {overallResult.generatedText && (
          <HighlightedText
            textChunks={overallResult.textChunks}
            highlightedChunks={overallResult.highlightedChunks} // Passing highlightedChunks to HighlightedText
          />
        )}
      </div>
    </div>
  );
}
