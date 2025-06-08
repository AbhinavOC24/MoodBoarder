//actual canvas

import { initDraw } from "@/draw/drawLogic";
import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./canvas/Toolbar";
import { DrawingSettingsSidebar, Component } from "./canvas/StyleOptions";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [currShape, updateShape] = useState<string>("pointer");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef("pointer");
  const [showStyleOptions, setShowStyleOptions] = useState(false);

  const handleClick = (currShape: any) => {
    shapeRef.current = currShape;
    updateShape(currShape);

    const toolsWithStyle = ["rect", "circle", "pencil", "arrow"]; // adjust to your app
    setShowStyleOptions(toolsWithStyle.includes(currShape));
  };

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket, shapeRef);
    }
  }, [canvasRef]);

  return (
    <div
      style={{ height: "100vh", overflow: "hidden" }}
      className="relative flex justify-center"
    >
      {showStyleOptions && (
        <div className="absolute flex gap-3 left-4 top-1/2 -translate-y-1/2 z-50">
          <DrawingSettingsSidebar />
        </div>
      )}
      <Toolbar changeShape={handleClick} currShape={currShape} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}

export default Canvas;
