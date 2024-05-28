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
  setModel1Result: React.Dispatch<React.SetStateAction<number | null>>;
  setModel2Result: React.Dispatch<React.SetStateAction<number | null>>;
  setModel3Result: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextAnalyser: React.FunctionComponent<TextAnalyserProps> = ({
  text,
  setOverallResult,
  setModel1Result,
  setModel2Result,
  setModel3Result,
  setIsSubmitted,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const CHUNK_SIZE = 705; // Maximum chunk size accepted by the model

  const models = [
    {
      name: "Hello-SimpleAI/chatgpt-detector-roberta",
      label: "ChatGPT",
      setter: setModel1Result,
    },
    {
      name: "openai-community/roberta-large-openai-detector",
      label: "LABEL_0",
      setter: setModel2Result,
    },
    {
      name: "andreas122001/roberta-academic-detector",
      label: "machine-generated",
      setter: setModel3Result,
    },
  ];

  const analyseText = async () => {
    setLoading(true);
    setIsSubmitted(true);
    try {
      let textChunks = [];
      let allScores = new Array(models.length).fill(0);
      let allCounts = new Array(models.length).fill(0);
      let highlightedChunks = [];
      // Split the text into chunks
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        textChunks.push(chunk);
      }

      // Analyse each chunk and collect label-score pairs
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        for (const chunk of textChunks) {
          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model.name}`,
            {
              method: "POST",
              body: JSON.stringify({ inputs: chunk }),
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            },
          );

          // Check for HTTP status codes
          if (response.status === 429) {
            throw new Error("Too many requests");
          } else if (response.status === 503) {
            throw new Error("Service unavailable");
          }

          const result = await response.json();
          if (Array.isArray(result[0])) {
            // Extract each label-score pair
            for (const item of result[0]) {
              if (item.label === model.label) {
                item.score = item.score * 100;
                model.setter(item.score);
                allScores[i] += item.score;
                allCounts[i]++;
                console.log("Score:", item.score);
                if (item.score > 50) {
                  highlightedChunks.push(chunk);
                  console.log("Highlighted chunk:", chunk);
                }
              }
            }
          }
        }
      }

      const machineGeneratedProbability =
        allScores.reduce((acc, curr) => acc + curr, 0) /
        allCounts.reduce((acc, curr) => acc + curr, 0);

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

      // Display appropriate error message to the user
      if ((error as Error).message === "Too many requests") {
        alert(
          "Too many requests sent to the Hugging Face API, please try again in 15 minutes.",
        );
      } else if ((error as Error).message === "Service unavailable") {
        alert(
          "Unable to connect to the models using the Hugging Face API, please reload the page and try again.",
        );
      }
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
