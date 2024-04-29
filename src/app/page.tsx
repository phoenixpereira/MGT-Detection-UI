"use client";

import "@/lib/env";
import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import OverallResults from "@/components/OverallResults";

export default function Home() {
  const [overallResult, setOverallResult] = useState<{
    machineGeneratedProbability: number | null;
    generatedText: string | null;
  }>({
    machineGeneratedProbability: null,
    generatedText: null,
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
        <FileUpload setOverallResult={setOverallResult} />
      </div>
    </div>
  );
}
