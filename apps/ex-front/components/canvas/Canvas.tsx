//actual canvas

import { drawLogic } from "@/draw/drawLogic";
import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import {
  DrawingSettingsSidebar,
  TextDrawingSettingsSidebar,
} from "./StyleOptions";
import { useDrawingSettings } from "@/stores/StyleOptionStore";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [currShape, updateShape] = useState<string>("pointer");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef("pointer");
  const drawingSettings = useDrawingSettings();
  const [activeSidebar, setActiveSidebar] = useState<"drawing" | "text" | null>(
    null
  );

  const handleClick = (currShape: string) => {
    shapeRef.current = currShape;
    updateShape(currShape);

    const toolsWithDrawingStyle = ["rect", "circle", "pencil", "arrow"];

    if (toolsWithDrawingStyle.includes(currShape)) {
      setActiveSidebar("drawing");
    } else if (currShape === "text") {
      setActiveSidebar("text");
    } else {
      setActiveSidebar(null);
    }
  };

  const renderSidebar = () => {
    switch (activeSidebar) {
      case "drawing":
        return <DrawingSettingsSidebar />;
      case "text":
        return <TextDrawingSettingsSidebar />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    let cleanupFn: (() => void) | undefined;

    const setup = async () => {
      if (!canvasRef.current) return;

      cleanupFn = await drawLogic(
        canvasRef.current,
        roomId,
        socket,
        shapeRef,
        drawingSettings,
        handleClick
      );
    };

    setup();

    return () => {
      cleanupFn?.(); // Call the actual cleanup function if it exists
    };
  }, [drawingSettings]);

  return (
    <div
      style={{ height: "100vh", overflow: "hidden" }}
      className="relative flex justify-center"
    >
      {activeSidebar && (
        <div className="absolute flex gap-3 left-4 top-1/2 -translate-y-1/2 z-50">
          {renderSidebar()}
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
