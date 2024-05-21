import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const Statistics = () => {
      const chartRefs = {
            averageWordCountRef: useRef(null),
            lexicalDiversityRef: useRef(null)
      };
      const [humanLexicalDiversity, setHumanLexicalDiversity] = useState([]);
      const [humanAvgSentenceLength, setHumanAvgSentenceLength] = useState([]);
      const [aiLexicalDiversity, setAiLexicalDiversity] = useState([]);
      const [aiAvgSentenceLength, setAiAvgSentenceLength] = useState([]);

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        const humanLexicalDiversityResponse = await fetch(
                              "/human_lexical_diversity_ranges.json"
                        );
                        const humanAvgSentenceLengthResponse = await fetch(
                              "/human_avg_sentence_length_ranges.json"
                        );
                        const aiLexicalDiversityResponse = await fetch(
                              "/ai_lexical_diversity_ranges.json"
                        );
                        const aiAvgSentenceLengthResponse = await fetch(
                              "/ai_avg_sentence_length_ranges.json"
                        );

                        const humanLexicalDiversityData =
                              await humanLexicalDiversityResponse.json();
                        const humanAvgSentenceLengthData =
                              await humanAvgSentenceLengthResponse.json();
                        const aiLexicalDiversityData = await aiLexicalDiversityResponse.json();
                        const aiAvgSentenceLengthData = await aiAvgSentenceLengthResponse.json();

                        setHumanLexicalDiversity(humanLexicalDiversityData);
                        setHumanAvgSentenceLength(humanAvgSentenceLengthData);
                        setAiLexicalDiversity(aiLexicalDiversityData);
                        setAiAvgSentenceLength(aiAvgSentenceLengthData);

                        // Create charts after fetching data
                        createCharts();
                  } catch (error) {
                        console.error("Error fetching data:", error);
                  }
            };

            fetchData();
      }, []);

      useEffect(() => {
            // Recreate charts whenever the data changes
            createCharts();
      }, [humanLexicalDiversity, humanAvgSentenceLength, aiLexicalDiversity, aiAvgSentenceLength]);

      const createCharts = () => {
            destroyChart(chartRefs.averageWordCountRef);
            destroyChart(chartRefs.lexicalDiversityRef);

            createChart(
                  "average_word_count",
                  chartRefs.averageWordCountRef,
                  humanAvgSentenceLength,
                  aiAvgSentenceLength
            );
            createChart(
                  "lexical_diversity",
                  chartRefs.lexicalDiversityRef,
                  humanLexicalDiversity,
                  aiLexicalDiversity
            );
      };

      const createChart = (statistic, chartRef, humanData, aiData) => {
            if (chartRef.current) {
                  const ctx = chartRef.current.getContext("2d");

                  if (ctx && humanData && aiData) {
                        const labels = Object.keys(humanData);

                        // Destroy existing chart if it exists
                        destroyChart(chartRef);

                        chartRef.current.chart = new Chart(ctx, {
                              type: "bar",
                              data: {
                                    labels: labels,
                                    datasets: [
                                          {
                                                label: "Human",
                                                data: labels.map((key) => humanData[key]),
                                                backgroundColor: "rgba(255, 99, 132, 0.2)",
                                                borderColor: "rgba(255, 99, 132, 1)",
                                                borderWidth: 1
                                          },
                                          {
                                                label: "AI",
                                                data: labels.map((key) => aiData[key]),
                                                backgroundColor: "rgba(54, 162, 235, 0.2)",
                                                borderColor: "rgba(54, 162, 235, 1)",
                                                borderWidth: 1
                                          }
                                    ]
                              },
                              options: {
                                    scales: {
                                          y: {
                                                beginAtZero: true
                                          }
                                    }
                              }
                        });
                  }
            }
      };

      const destroyChart = (chartRef) => {
            if (chartRef.current && chartRef.current.chart) {
                  chartRef.current.chart.destroy();
            }
      };

      return (
            <div>
                  <div>
                        <h2>Average Word Count</h2>
                        <canvas ref={chartRefs.averageWordCountRef}></canvas>
                  </div>
                  <div>
                        <h2>Lexical Diversity</h2>
                        <canvas ref={chartRefs.lexicalDiversityRef}></canvas>
                  </div>
            </div>
      );
};

export default Statistics;
