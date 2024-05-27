import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

interface Data {
  [key: string]: {
    [key: string]: number;
  };
}

interface StatisticsProps {
  userText: string;
}

const Statistics: React.FunctionComponent<StatisticsProps> = ({ userText }) => {
  const chartRefs = {
    avgSentenceLengthRef: useRef<HTMLCanvasElement>(null),
    lexicalDiversityRef: useRef<HTMLCanvasElement>(null),
  };
  const [humanData, setHumanData] = useState<Data>({});
  const [aiData, setAIData] = useState<Data>({});

  const calculateAvgSentenceLength = (text: string): number => {
    const sentences = text.split(/[.!?]/);
    const totalWords = sentences.reduce((total, sentence) => {
      const words = sentence.trim().split(/\s+/);
      return total + words.length;
    }, 0);
    return totalWords / sentences.length;
  };

  const calculateLexicalDiversity = (text: string): number => {
    const words = text.trim().split(/\s+/);
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/combined_analysis.json");
        const data = await response.json();

        const avgSentenceLength = calculateAvgSentenceLength(userText);
        console.log(avgSentenceLength);
        const humanLexicalDiversity = calculateLexicalDiversity(userText);
        console.log(humanLexicalDiversity);

        setHumanData({
          lexicalDiversity: data.human.lexical_diversity_ranges,
          avgSentenceLength: data.human.avg_sentence_length_ranges,
        });

        setAIData({
          lexicalDiversity: data.ai.lexical_diversity_ranges,
          avgSentenceLength: data.ai.avg_sentence_length_ranges,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(humanData).length > 0 && Object.keys(aiData).length > 0) {
      createCharts();
    }
  }, [humanData, aiData]);

  const createCharts = () => {
    createChart(
      "Lexical Diversity",
      chartRefs.lexicalDiversityRef,
      humanData.lexicalDiversity,
      aiData.lexicalDiversity,
      calculateLexicalDiversity(userText) * 18.5,
    );
    createChart(
      "Average Sentence Length",
      chartRefs.avgSentenceLengthRef,
      humanData.avgSentenceLength,
      aiData.avgSentenceLength,
      calculateAvgSentenceLength(userText) * 0.2,
    );
  };

  const createChart = (
    title: string,
    chartRef: React.RefObject<HTMLCanvasElement>,
    humanData: { [key: string]: number },
    aiData: { [key: string]: number },
    userTextValue: number, // Pass userText value to the function
  ) => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        const labels = Object.keys(humanData);

        // Destroy existing chart if it exists
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Human",
                data: labels.map((key) => humanData[key]),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "AI",
                data: labels.map((key) => aiData[key]),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category", // Explicitly set the scale type to category
                labels: labels, // Ensure all labels are present
                ticks: {
                  maxTicksLimit: 10,
                },
              },
              y: {
                beginAtZero: true,
                suggestedMin:
                  title === "Average Sentence Length" ? 0 : undefined, // Set suggestedMin based on the chart title
                suggestedMax: title === "Average Sentence Length" ? 100 : 1, // Set suggestedMax based on the chart title
              },
            },
            plugins: {
              title: {
                display: true,
                text: title,
              },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    mode: "vertical",
                    scaleID: "x",
                    value: userTextValue,
                    borderColor: "black",
                    borderWidth: 3,
                  },
                ],
              },
            },
          },
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <h2>Average Sentence Length</h2>
        <canvas ref={chartRefs.avgSentenceLengthRef}></canvas>
      </div>
      <div>
        <h2>Lexical Diversity</h2>
        <canvas ref={chartRefs.lexicalDiversityRef}></canvas>
      </div>
    </div>
  );
};

export default Statistics;
