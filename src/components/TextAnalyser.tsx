import React, { useState } from "react";
import "react-circular-progressbar/dist/styles.css";

interface TextAnalyserProps {
  text: string;
  highlightedChunks: any[];
  textChunks: any[];
  setOverallResult: React.Dispatch<
    React.SetStateAction<{
      machineGeneratedProbability: number | null;
      generatedText: string | null;
      highlightedChunks: any[];
      textChunks: any[];
    }>
  >;
}

const TextAnalyser: React.FunctionComponent<TextAnalyserProps> = ({
  text,
  setOverallResult,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const CHUNK_SIZE = 705; // Maximum chunk size accepted by the model

  const analyseText = async () => {
    setLoading(true);
    try {
      let textChunks = [];
      // Split the text into chunks
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        textChunks.push(chunk);
      }

      // Analyse each chunk and collect label-score pairs
      let chatGPTScoreSum = 0;
      let chatGPTCount = 0;
      let highlightedChunks = [];
      for (const chunk of textChunks) {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta",
          {
            method: "POST",
            body: JSON.stringify({ inputs: chunk }),
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();
        if (Array.isArray(result[0])) {
          // Extract each label-score pair
          for (const item of result[0]) {
            if (item.label === "ChatGPT") {
              //   console.log("ChatGPT score:", item.score);
              // If the chunk is likely to be machine-generated, mark it
              if (item.score > 0.5) {
                highlightedChunks.push(chunk);
                console.log("Highlighted chunk:", chunk);
              }
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
      const machineGeneratedProbability =
        (chatGPTScoreSum / chatGPTCount) * 100;

      // Set generated text based on probability
      let generatedText: string;
      if (machineGeneratedProbability === null) {
        generatedText = "Analysis result not available.";
      } else if (machineGeneratedProbability <= 10) {
        generatedText = "This text is highly likely to be human-generated.";
      } else if (machineGeneratedProbability <= 25) {
        generatedText = "This text is likely to be human-generated.";
      } else if (machineGeneratedProbability <= 40) {
        generatedText =
          "This text may be human-generated or machine-generated.";
      } else if (machineGeneratedProbability <= 60) {
        generatedText =
          "This text may be machine-generated or human-generated.";
      } else if (machineGeneratedProbability <= 75) {
        generatedText = "This text is likely to be machine-generated.";
      } else {
        generatedText = "This text is highly likely to be machine-generated.";
      }

      // Set the overall result including highlightedChunks
      setOverallResult({
        machineGeneratedProbability,
        generatedText,
        highlightedChunks,
        textChunks,
      });
    } catch (error) {
      console.error("Error analysing text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded-md"
        onClick={analyseText}
        disabled={loading}
      >
        {loading ? "Analysing..." : "Analyse Text"}
      </button>
    </div>
  );
};

export default TextAnalyser;
