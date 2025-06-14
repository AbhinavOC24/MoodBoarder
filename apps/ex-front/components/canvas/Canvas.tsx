//actual canvas

import { drawLogic } from "@/draw/drawLogic";
import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import {
  DrawingSettingsSidebar,
  TextDrawingSettingsSidebar,
  ArrowSettingsSidebar,
  PencilSettingsSidebar,
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
  const [activeSidebar, setActiveSidebar] = useState<
    "drawing" | "text" | "arrow" | "pencil" | null
  >(null);

  const handleClick = (currShape: string) => {
    shapeRef.current = currShape;
    updateShape(currShape);

    const toolsWithDrawingStyle = ["rect", "circle"];

    if (toolsWithDrawingStyle.includes(currShape)) {
      setActiveSidebar("drawing");
    } else if (currShape === "text") {
      setActiveSidebar("text");
    } else if (currShape === "arrow") {
      setActiveSidebar("arrow");
    } else if (currShape === "pencil") {
      setActiveSidebar("pencil");
    } else {
      setActiveSidebar(null);
    }
  };
  const zoomIn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const currentZoom = zoomRef.current;
    const newZoom = Math.min(10, currentZoom * 1.2); // Max zoom 10x
    zoomRef.current = newZoom;

    // Zoom towards center
    offsetRef.current.x =
      centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y =
      centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  };

  // Zoom out function
  const zoomOut = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const currentZoom = zoomRef.current;
    const newZoom = Math.max(0.1, currentZoom / 1.2); // Min zoom 0.1x
    zoomRef.current = newZoom;

    // Zoom towards center
    offsetRef.current.x =
      centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y =
      centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  };

  // Reset zoom to 100%
  const resetZoom = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    zoomRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    redraw();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    cleanupFn?.(); // Call the actual cleanup function if it exists

    ctx.restore();
  };
  const renderSidebar = () => {
    switch (activeSidebar) {
      case "drawing":
        return <DrawingSettingsSidebar />;
      case "text":
        return <TextDrawingSettingsSidebar />;
      case "arrow":
        return <ArrowSettingsSidebar />;
      case "pencil":
        return <PencilSettingsSidebar />;
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

      redraw();
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only allow panning when hand tool is selected
      if (shapeRef.current === "hand") {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor based on current tool
      if (shapeRef.current === "hand" && !isDragging) {
        canvas.style.cursor = "grab";
      } else if (shapeRef.current !== "hand") {
        canvas.style.cursor = "default";
      }

      // Only pan when dragging with hand tool
      if (!isDragging || shapeRef.current !== "hand") return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      offsetRef.current.x += dx;
      offsetRef.current.y += dy;
      lastX = e.clientX;
      lastY = e.clientY;
      redraw();
    };

    const handleMouseUp = () => {
      if (isDragging && shapeRef.current === "hand") {
        canvas.style.cursor = "grab";
      }
      isDragging = false;
    };

    // Keyboard shortcuts for zoom
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Plus or Equal for zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      }
      // Ctrl/Cmd + Minus for zoom out
      else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
      // Ctrl/Cmd + 0 for reset zoom
      else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{ height: "100vh", overflow: "hidden" }}
      className="relative flex justify-center"
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
          title="Zoom In (Ctrl/Cmd + +)"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
          title="Zoom Out (Ctrl/Cmd + -)"
        >
          -
        </button>
        <button
          onClick={resetZoom}
          className="bg-white border border-gray-300 rounded px-2 py-1 shadow hover:bg-gray-50 text-xs"
          title="Reset Zoom (Ctrl/Cmd + 0)"
        >
          {Math.round(zoomRef.current * 100)}%
        </button>
      </div>

      {activeSidebar && (
        <div className="absolute flex gap-3 left-4 top-1/2 -translate-y-1/2 z-50">
          {renderSidebar()}
        </div>
      )}

      <Toolbar changeShape={handleClick} currShape={currShape} />
      <canvas
        ref={canvasRef}
        width={10 * window.innerWidth}
        height={10 * window.innerHeight}
      ></canvas>
    </div>
  );
}

export default Canvas;
