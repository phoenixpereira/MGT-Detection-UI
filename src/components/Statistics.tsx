import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const Statistics = () => {
  const chartRefs = {
    avgSentenceLengthRef: useRef(null),
    lexicalDiversityRef: useRef(null),
  };
  const [humanLexicalDiversity, setHumanLexicalDiversity] = useState({});
  const [humanAvgSentenceLength, setHumanAvgSentenceLength] = useState({});
  const [aiLexicalDiversity, setAiLexicalDiversity] = useState({});
  const [aiAvgSentenceLength, setAiAvgSentenceLength] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const humanLexicalDiversityResponse = await fetch(
          "/human_lexical_diversity_ranges.json",
        );
        const humanAvgSentenceLengthResponse = await fetch(
          "/human_avg_sentence_length_ranges.json",
        );
        const aiLexicalDiversityResponse = await fetch(
          "/ai_lexical_diversity_ranges.json",
        );
        const aiAvgSentenceLengthResponse = await fetch(
          "/ai_avg_sentence_length_ranges.json",
        );

        const humanLexicalDiversityData =
          await humanLexicalDiversityResponse.json();
        const humanAvgSentenceLengthData =
          await humanAvgSentenceLengthResponse.json();
        const aiLexicalDiversityData = await aiLexicalDiversityResponse.json();
        const aiAvgSentenceLengthData =
          await aiAvgSentenceLengthResponse.json();

        setHumanLexicalDiversity(humanLexicalDiversityData);
        setHumanAvgSentenceLength(humanAvgSentenceLengthData);
        setAiLexicalDiversity(aiLexicalDiversityData);
        setAiAvgSentenceLength(aiAvgSentenceLengthData);

        // Create charts after fetching data
        createCharts(
          humanLexicalDiversityData,
          aiLexicalDiversityData,
          humanAvgSentenceLengthData,
          aiAvgSentenceLengthData,
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

const createCharts = (
    humanLexicalDiversityData: object,
    aiLexicalDiversityData: object,
    humanAvgSentenceLengthData: object,
    aiAvgSentenceLengthData: object,
) => {
    createChart(
      "Lexical Diversity",
      chartRefs.lexicalDiversityRef,
      humanLexicalDiversityData,
      aiLexicalDiversityData,
    );
    createChart(
      "Average Sentence Length",
      chartRefs.avgSentenceLengthRef,
      humanAvgSentenceLengthData,
      aiAvgSentenceLengthData,
    );
  };

  const createChart = (title, chartRef, humanData, aiData) => {
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
                ticks: {
                  maxTicksLimit: 10,
                },
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              title: {
                display: true,
                text: title,
              },
            },
          },
        });
      }
    }
  };

  return (
    <div>
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
