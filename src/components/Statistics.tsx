import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

interface Data {
      [key: string]: {
            [key: string]: number;
      };
}

const Statistics = () => {
      const chartRefs = {
            avgSentenceLengthRef: useRef(null),
            lexicalDiversityRef: useRef(null)
      };
      const [humanData, setHumanData] = useState<Data>({});
      const [aiData, setAIData] = useState<Data>({});


      useEffect(() => {
            const fetchData = async () => {
                  try {
                        const response = await fetch("/combined_analysis.json");
                        const data = await response.json();

                        setHumanData({
                              lexicalDiversity: data.human.lexical_diversity_ranges,
                              avgSentenceLength: data.human.avg_sentence_length_ranges
                        });

                        setAIData({
                              lexicalDiversity: data.ai.lexical_diversity_ranges,
                              avgSentenceLength: data.ai.avg_sentence_length_ranges
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
                  aiData.lexicalDiversity
            );
            createChart(
                  "Average Sentence Length",
                  chartRefs.avgSentenceLengthRef,
                  humanData.avgSentenceLength,
                  aiData.avgSentenceLength
            );
      };

      const createChart = (
            title: string,
            chartRef: React.RefObject<HTMLCanvasElement>,
            humanData: { [key: string]: number },
            aiData: { [key: string]: number }
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
                                                tension: 0.4
                                          },
                                          {
                                                label: "AI",
                                                data: labels.map((key) => aiData[key]),
                                                backgroundColor: "rgba(54, 162, 235, 0.2)",
                                                borderColor: "rgba(54, 162, 235, 1)",
                                                fill: true,
                                                tension: 0.4
                                          }
                                    ]
                              },
                              options: {
                                    scales: {
                                          x: {
                                                ticks: {
                                                      maxTicksLimit: 10
                                                }
                                          },
                                          y: {
                                                beginAtZero: true
                                          }
                                    },
                                    plugins: {
                                          title: {
                                                display: true,
                                                text: title
                                          }
                                    }
                              }
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
