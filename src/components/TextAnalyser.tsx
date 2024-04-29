import React, { useState } from "react";

interface TextAnalyserProps {
  text: string;
}

interface LabelScore {
  label: string;
  score: number;
}

const TextAnalyser: React.FunctionComponent<TextAnalyserProps> = ({ text }) => {
  const [machineGeneratedProbability, setMachineGeneratedProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const CHUNK_SIZE = 705; // Maximum chunk size accepted by the model

  const analyseText = async () => {
    setLoading(true);
    try {
      // Split the text into chunks
      const chunks = [];
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        chunks.push(chunk);
      }

      // Analyze each chunk and collect label-score pairs
      let chatGPTScoreSum = 0;
      let chatGPTCount = 0;
      for (const chunk of chunks) {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta",
          {
            method: "POST",
            body: JSON.stringify({ inputs: chunk }),
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (Array.isArray(result[0])) {
          // Extract each label-score pair
          for (const item of result[0]) {
            if (item.label === "ChatGPT") {
              chatGPTScoreSum += item.score;
              chatGPTCount++;
            }
          }
        }
      }

      if (chatGPTCount === 0) {
        throw new Error("No ChatGPT scores found in the analysis result.");
      }

      // Calculate the probability of text being machine-generated
      const machineGeneratedProbability = (chatGPTScoreSum / chatGPTCount) * 100;

      setMachineGeneratedProbability(machineGeneratedProbability);
    } catch (error) {
      console.error("Error analysing text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        onClick={analyseText}
        disabled={loading}
      >
        {loading ? "Analysing..." : "Analyse Text"}
      </button>
      {machineGeneratedProbability !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Analysis Result</h2>
          <p>Probability of text being machine-generated: {machineGeneratedProbability.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default TextAnalyser;
