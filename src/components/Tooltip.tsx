import React, { useState } from "react";

type TooltipProps = {
  info: string;
};

function Tooltip({ info }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block mr-2">
      <div
        className="w-8 h-8 flex items-center justify-center bg-white text-black border-2 border-black rounded-full cursor-pointer"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        i
      </div>
      {showTooltip && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 text-sm text-white bg-black rounded shadow-lg z-10 w-64">
          {info}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
