import React, { useEffect, useRef, useState } from "react";
import { drawLogic } from "@/draw/drawLogic";
import { clearCanvas } from "@/utils/clearCanvas";
import Toolbar from "./Toolbar";
import {
  DrawingSettingsSidebar,
  TextDrawingSettingsSidebar,
  ArrowSettingsSidebar,
  PencilSettingsSidebar,
} from "./StyleOptions";
import { useDrawingSettings } from "@/stores/StyleOptionStore";
const generateColor = (userId: string) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [currShape, updateShape] = useState<string>("pointer");
  const [activeSidebar, setActiveSidebar] = useState<
    "drawing" | "text" | "arrow" | "pencil" | null
  >(null);
  const [zoomStatus, updateZoomStatus] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const shapeRef = useRef("pointer");
  const existingShapesRef = useRef<any[]>([]);
  const drawingSettings = useDrawingSettings();
  const settingsRef = useRef(drawingSettings);
  const otherCursorsRef = useRef<{
    [userId: string]: { x: number; y: number; username: string; color: string };
  }>({});

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const userId = localStorage.getItem("userId");

      if (data.type === "mouse-move" && data.userId !== userId) {
        otherCursorsRef.current[data.userId] = {
          x: data.x,
          y: data.y,
          username: data.username,
          color: generateColor(data.userId),
        };
        redraw();
      }

      // handle other messages...
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);
  // Update settingsRef when drawing settings change
  useEffect(() => {
    settingsRef.current = drawingSettings;
  }, [drawingSettings]);

  // Initialize draw logic
  useEffect(() => {
    if (!canvasRef.current) return;
    let cleanupFn: (() => void) | undefined;

    const setup = async () => {
      cleanupFn = await drawLogic(
        canvasRef.current!,
        roomId,
        socket,
        shapeRef,
        settingsRef,
        handleShapeChange,
        zoomRef,
        offsetRef,
        existingShapesRef,
        getCanvasCoordinates
      );
    };

    setup();
    return () => cleanupFn?.();
  }, [canvasRef, roomId, socket]);

  // Mouse + keyboard controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    let isDragging = false;
    let lastX = 0,
      lastY = 0;
    const handleMouseMoveSync = (e: MouseEvent) => {
      const coords = getCanvasCoordinates(e, canvas);

      socket.send(
        JSON.stringify({
          type: "mouse-move",
          userId,
          username,
          roomId,
          x: coords.x,
          y: coords.y,
        })
      );
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { clientX, clientY, deltaY } = e;
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      const newZoom =
        deltaY < 0 ? zoomRef.current * 1.1 : zoomRef.current / 1.1;
      applyZoom(Math.max(0.1, Math.min(3, newZoom)), mouseX, mouseY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (shapeRef.current === "hand") {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (shapeRef.current === "hand") {
        canvas.style.cursor = isDragging ? "grabbing" : "grab";
      } else {
        canvas.style.cursor = "default";
      }

      if (isDragging && shapeRef.current === "hand") {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        offsetRef.current.x += dx;
        offsetRef.current.y += dy;
        lastX = e.clientX;
        lastY = e.clientY;
        redraw();
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        canvas.style.cursor = "grab";
      }
      isDragging = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };
    canvas.addEventListener("mousemove", handleMouseMoveSync);
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
      canvas.removeEventListener("mousemove", handleMouseMoveSync);
    };
  }, []);

  // Zoom helpers
  const applyZoom = (newZoom: number, centerX: number, centerY: number) => {
    const currentZoom = zoomRef.current;
    zoomRef.current = newZoom;
    updateZoomStatus(newZoom);

    offsetRef.current.x =
      centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y =
      centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  };

  const zoomIn = () => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    applyZoom(Math.min(3, zoomRef.current * 1.2), width / 2, height / 2);
  };

  const zoomOut = () => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    applyZoom(Math.max(0.1, zoomRef.current / 1.2), width / 2, height / 2);
  };

  const resetZoom = () => {
    applyZoom(1, canvasRef.current!.width / 2, canvasRef.current!.height / 2);
    offsetRef.current = { x: 0, y: 0 };
  };

  // Redraw canvas
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
    clearCanvas(existingShapesRef.current, canvas, ctx, zoomRef, offsetRef);
    Object.values(otherCursorsRef.current).forEach((cursor) => {
      ctx.fillStyle = cursor.color;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 5 / zoomRef.current, 0, 2 * Math.PI);
      ctx.fill();

      ctx.font = `${12 / zoomRef.current}px sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.fillText(
        cursor.username,
        cursor.x + 8 / zoomRef.current,
        cursor.y - 8 / zoomRef.current
      );
    });
    ctx.restore();
  };

  // Handle shape/tool change
  const handleShapeChange = (shape: string) => {
    shapeRef.current = shape;
    updateShape(shape);

    if (["rect", "circle"].includes(shape)) {
      setActiveSidebar("drawing");
    } else if (shape === "text") {
      setActiveSidebar("text");
    } else if (shape === "arrow") {
      setActiveSidebar("arrow");
    } else if (shape === "pencil") {
      setActiveSidebar("pencil");
    } else {
      setActiveSidebar(null);
    }
  };

  // Get canvas coordinates
  const getCanvasCoordinates = (e: MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return {
      x: (mouseX - offsetRef.current.x) / zoomRef.current,
      y: (mouseY - offsetRef.current.y) / zoomRef.current,
    };
  };

  return (
    <div className="relative flex justify-center h-screen overflow-hidden">
      <div className="absolute top-4 right-4 z-50 flex flex-col text-black gap-2">
        <button onClick={zoomIn} className="zoom-btn">
          +
        </button>
        <button onClick={zoomOut} className="zoom-btn">
          -
        </button>
        <button onClick={resetZoom} className="zoom-btn text-xs">
          {Math.round(zoomStatus * 100)}%
        </button>
      </div>

      {activeSidebar && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
          {activeSidebar === "drawing" && <DrawingSettingsSidebar />}
          {activeSidebar === "text" && <TextDrawingSettingsSidebar />}
          {activeSidebar === "arrow" && <ArrowSettingsSidebar />}
          {activeSidebar === "pencil" && <PencilSettingsSidebar />}
        </div>
      )}

      <Toolbar changeShape={handleShapeChange} currShape={currShape} />

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={`w-full h-full ${
          ["pointer", "pan", "eraser"].includes(currShape)
            ? "cursor-default"
            : "cursor-crosshair"
        }`}
      />
    </div>
  );
}

export default Canvas;
