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
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [currShape, updateShape] = useState<string>("pointer");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef("pointer");
  const drawingSettings = useDrawingSettings();
  const settingsRef = useRef(drawingSettings);
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
    settingsRef.current = drawingSettings;
  }, [drawingSettings]);
  useEffect(() => {
    if (!canvasRef.current) return;

    let cleanupFn: (() => void) | undefined;

    const setup = async () => {
      if (!canvasRef.current) return;
      console.log("got called");
      cleanupFn = await drawLogic(
        canvasRef.current,
        roomId,
        socket,
        shapeRef,
        settingsRef,
        handleClick,
        zoomRef,
        offsetRef
      );
    };

    setup();

    return () => {
      console.log("cleanup trigger");

      cleanupFn?.(); // Call the actual cleanup function if it exists
    };
  }, [canvasRef, roomId, socket]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const draw = () => {
      ctx.save();
      ctx.setTransform(
        zoomRef.current,
        0,
        0,
        zoomRef.current,
        offsetRef.current.x,
        offsetRef.current.y
      );
      ctx.clearRect(
        -offsetRef.current.x / zoomRef.current,
        -offsetRef.current.y / zoomRef.current,
        canvas.width / zoomRef.current,
        canvas.height / zoomRef.current
      );
      // 🔴 Call your actual draw function here if needed
      ctx.restore();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomIntensity = 0.1;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentZoom = zoomRef.current;
      const newZoom =
        e.deltaY < 0
          ? currentZoom * (1 + zoomIntensity)
          : currentZoom * (1 - zoomIntensity);
      zoomRef.current = Math.max(0.1, Math.min(10, newZoom)); // clamp zoom

      // Adjust pan offset to zoom around the cursor
      offsetRef.current.x =
        mouseX - ((mouseX - offsetRef.current.x) / currentZoom) * newZoom;
      offsetRef.current.y =
        mouseY - ((mouseY - offsetRef.current.y) / currentZoom) * newZoom;

      draw();
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      offsetRef.current.x += dx;
      offsetRef.current.y += dy;
      lastX = e.clientX;
      lastY = e.clientY;
      draw();
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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
