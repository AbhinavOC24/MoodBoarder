//actual canvas

import { initDraw } from "@/draw/drawLogic";
import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./canvas/Toolbar";
function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [currShape, updateShape] = useState<string>("pointer");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef("pointer");

  const handleClick = (currShape: any) => {
    shapeRef.current = currShape;
    updateShape(currShape);
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
