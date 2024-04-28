import React from "react";

interface TextDisplayProps {
      text: string;
}

function TextDisplay({ text }: TextDisplayProps) {
      return (
            <div className="p-4 bg-gray-100">
                  <p>{text}</p>
            </div>
      );
}

export default TextDisplay;
