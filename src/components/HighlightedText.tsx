import React from "react";
import Tooltip from "./Tooltip";

const HighlightedText = ({
  textChunks,
  highlightedChunks,
}: {
  textChunks: any[];
  highlightedChunks: any[];
}) => {
  const renderHighlightedText = () => {
    let result = [];
    let currentIndex = 0;

    textChunks.forEach((chunk, index) => {
      // Check if highlighted
      if (highlightedChunks.includes(chunk)) {
        // Highlight the chunk
        result.push(
          <span
            key={`highlighted_${index}`}
            style={{ backgroundColor: "yellow" }}
          >
            {textChunks[index]}
          </span>,
        );
      } else {
        // Add normal text before the chunk
        result.push(<span key={`normal_${index}`}>{textChunks[index]}</span>);
      }

      currentIndex += textChunks[index].length; // Update currentIndex to the end of the chunk
    });

    // Add remaining text after the last chunk
    if (currentIndex < textChunks.length) {
      result.push(
        <span key="remaining">{textChunks.slice(currentIndex)}</span>,
      );
    }

    return result;
  };

  return (
    <div className="flex p-4 border border-gray-300 rounded-md shadow-md">
      <div>{renderHighlightedText()}</div>
      <Tooltip info="Chunks of text that the models believe are machine-generated are highlighted." />
    </div>
  );
};

export default HighlightedText;
