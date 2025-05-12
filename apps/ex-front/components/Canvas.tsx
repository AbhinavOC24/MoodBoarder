//actual canvas

import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentShape, updateShape] = useState<string>("pointer");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateShape(e.currentTarget.innerHTML);
  };
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket, currentShape, updateShape); //draw logic
    }
  }, [canvasRef, currentShape]);
  return (
    <div>
      <canvas ref={canvasRef} width={2000} height={1000}></canvas>
      <div className="flex gap-4 translate-y-[-280px]">
        <button className="border rounded px-4 py-2 bg-white text-black shadow hover:bg-gray-200 transition" onClick={handleClick}>rect</button>
        <button className="border rounded px-4 py-2 bg-white text-black shadow hover:bg-gray-200 transition" onClick={handleClick}>pointer</button>
        <button className="border rounded px-4 py-2 bg-white text-black shadow hover:bg-gray-200 transition" onClick={handleClick}>circle</button>
      </div>
    </div>
  );
}

export default Canvas;
