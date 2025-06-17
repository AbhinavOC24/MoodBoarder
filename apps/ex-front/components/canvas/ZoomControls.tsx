import React from "react";
import { ZoomRefs } from "./hooks/useZoom";

interface ZoomControlsProps {
  zoomRefs: ZoomRefs;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomRefs }) => {
  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={zoomRefs.zoomIn}
        className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
        title="Zoom In (Ctrl/Cmd + +)"
      >
        +
      </button>
      <button
        onClick={zoomRefs.zoomOut}
        className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
        title="Zoom Out (Ctrl/Cmd + -)"
      >
        -
      </button>
      <button
        onClick={zoomRefs.resetZoom}
        className="bg-white border border-gray-300 rounded px-2 py-1 shadow hover:bg-gray-50 text-xs"
        title="Reset Zoom (Ctrl/Cmd + 0)"
      >
        {Math.round(zoomRefs.zoomRef.current * 100)}%
      </button>
    </div>
  );
};
