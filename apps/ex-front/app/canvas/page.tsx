"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

function canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      initDraw(ctx, canvas);
    }
  }, [canvasRef]);
  return (
    <div>
      <canvas ref={canvasRef} width={2000} height={1000}>
        canvas
      </canvas>
    </div>
  );
}

export default canvas;
