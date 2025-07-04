// //actual canvas

// import { drawLogic } from "@/draw/drawLogic";
// import React, { useEffect, useRef, useState } from "react";
// import { clearCanvas } from "@/utils/clearCanvas";
// import Toolbar from "./Toolbar";
// import {
//   DrawingSettingsSidebar,
//   TextDrawingSettingsSidebar,
//   ArrowSettingsSidebar,
//   PencilSettingsSidebar,
// } from "./StyleOptions";
// import { useDrawingSettings } from "@/stores/StyleOptionStore";

// function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
//   const [zoomStatus, updateZoomStatus] = useState<number>();
//   const zoomRef = useRef(1);
//   const offsetRef = useRef({ x: 0, y: 0 });
//   const [currShape, updateShape] = useState<string>("pointer");
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const existingShapesRef = useRef<any[]>([]);

//   const shapeRef = useRef("pointer");
//   const drawingSettings = useDrawingSettings();
//   const settingsRef = useRef(drawingSettings);
//   const [activeSidebar, setActiveSidebar] = useState<
//     "drawing" | "text" | "arrow" | "pencil" | null
//   >(null);

//   useEffect(() => {
//     settingsRef.current = drawingSettings;
//   }, [drawingSettings]);
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     let cleanupFn: (() => void) | undefined;

//     const setup = async () => {
//       if (!canvasRef.current) return;

//       cleanupFn = await drawLogic(
//         canvasRef.current,
//         roomId,
//         socket,
//         shapeRef,
//         settingsRef,
//         handleClick,
//         zoomRef,
//         offsetRef,
//         existingShapesRef,
//         getCanvasCoordinates
//       );
//     };

//     setup();

//     return () => {
//       cleanupFn?.();
//     };
//   }, [canvasRef, roomId, socket]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let isDragging = false;
//     let lastX = 0;
//     let lastY = 0;

//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();

//       const zoomIntensity = 0.1;
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;

//       const currentZoom = zoomRef.current;
//       const newZoom =
//         e.deltaY < 0
//           ? currentZoom * (1 + zoomIntensity)
//           : currentZoom * (1 - zoomIntensity);

//       const clampedZoom = Math.max(0.1, Math.min(3, newZoom));

//       if (clampedZoom !== currentZoom) {
//         zoomRef.current = clampedZoom;

//         updateZoomStatus(zoomRef.current);

//         // Adjust pan offset to zoom around the cursor
//         offsetRef.current.x =
//           mouseX - ((mouseX - offsetRef.current.x) / currentZoom) * clampedZoom;
//         offsetRef.current.y =
//           mouseY - ((mouseY - offsetRef.current.y) / currentZoom) * clampedZoom;

//         redraw();
//       }
//     };

//     const handleMouseDown = (e: MouseEvent) => {
//       // Only allow panning when hand tool is selected
//       if (shapeRef.current === "hand") {
//         isDragging = true;
//         lastX = e.clientX;
//         lastY = e.clientY;
//         canvas.style.cursor = "grabbing";
//       }
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       // Update cursor based on current tool
//       if (shapeRef.current === "hand" && !isDragging) {
//         canvas.style.cursor = "grab";
//       } else if (shapeRef.current !== "hand") {
//         canvas.style.cursor = "default";
//       }

//       // Only pan when dragging with hand tool
//       if (!isDragging || shapeRef.current !== "hand") return;

//       const dx = e.clientX - lastX;
//       const dy = e.clientY - lastY;
//       offsetRef.current.x += dx;
//       offsetRef.current.y += dy;
//       lastX = e.clientX;
//       lastY = e.clientY;
//       redraw();
//     };

//     const handleMouseUp = () => {
//       if (isDragging && shapeRef.current === "hand") {
//         canvas.style.cursor = "grab";
//       }
//       isDragging = false;
//     };

//     // Keyboard shortcuts for zoom
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Ctrl/Cmd + Plus or Equal for zoom in
//       if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
//         e.preventDefault();
//         zoomIn();
//       }
//       // Ctrl/Cmd + Minus for zoom out
//       else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
//         e.preventDefault();
//         zoomOut();
//       }
//       // Ctrl/Cmd + 0 for reset zoom
//       else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
//         e.preventDefault();
//         resetZoom();
//       }
//     };

//     canvas.addEventListener("wheel", handleWheel, { passive: false });
//     canvas.addEventListener("mousedown", handleMouseDown);
//     canvas.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       canvas.removeEventListener("wheel", handleWheel);
//       canvas.removeEventListener("mousedown", handleMouseDown);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   const handleClick = (currShape: string) => {
//     shapeRef.current = currShape;
//     updateShape(currShape);

//     const toolsWithDrawingStyle = ["rect", "circle"];

//     if (toolsWithDrawingStyle.includes(currShape)) {
//       setActiveSidebar("drawing");
//     } else if (currShape === "text") {
//       setActiveSidebar("text");
//     } else if (currShape === "arrow") {
//       setActiveSidebar("arrow");
//     } else if (currShape === "pencil") {
//       setActiveSidebar("pencil");
//     } else {
//       setActiveSidebar(null);
//     }
//   };
//   const zoomIn = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     const currentZoom = zoomRef.current;
//     const newZoom = Math.min(3, currentZoom * 1.2); // Cap at 3 (300%)
//     zoomRef.current = newZoom;

//     updateZoomStatus(zoomRef.current);
//     // Zoom towards center
//     offsetRef.current.x =
//       centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
//     offsetRef.current.y =
//       centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

//     redraw();
//   };

//   // Zoom out function
//   const zoomOut = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     const currentZoom = zoomRef.current;
//     const newZoom = Math.max(0.1, currentZoom / 1.2); // Min zoom 0.1x
//     zoomRef.current = newZoom;
//     updateZoomStatus(zoomRef.current);
//     // Zoom towards center
//     offsetRef.current.x =
//       centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
//     offsetRef.current.y =
//       centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

//     redraw();
//   };

//   // Reset zoom to 100%
//   const resetZoom = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     zoomRef.current = 1;
//     updateZoomStatus(zoomRef.current);

//     offsetRef.current = { x: 0, y: 0 };
//     redraw();
//   };

//   const redraw = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.save();
//     ctx.setTransform(
//       zoomRef.current,
//       0,
//       0,
//       zoomRef.current,
//       offsetRef.current.x,
//       offsetRef.current.y
//     );
//     ctx.clearRect(
//       -offsetRef.current.x / zoomRef.current,
//       -offsetRef.current.y / zoomRef.current,
//       canvas.width / zoomRef.current,
//       canvas.height / zoomRef.current
//     );
//     // 🔴 Call your actual draw function here if needed

//     let cleanupFn: (() => void) | undefined;

//     const setup = async () => {
//       if (!canvasRef.current) return;

//       clearCanvas(existingShapesRef.current, canvas, ctx, zoomRef, offsetRef);
//     };

//     setup();

//     cleanupFn?.(); // Call the actual cleanup function if it exists

//     ctx.restore();
//   };
//   const renderSidebar = () => {
//     switch (activeSidebar) {
//       case "drawing":
//         return <DrawingSettingsSidebar />;
//       case "text":
//         return <TextDrawingSettingsSidebar />;
//       case "arrow":
//         return <ArrowSettingsSidebar />;
//       case "pencil":
//         return <PencilSettingsSidebar />;
//       default:
//         return null;
//     }
//   };

//   const getCanvasCoordinates = (e: MouseEvent, canvas: HTMLCanvasElement) => {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     // Transform mouse coordinates to canvas coordinate system
//     const canvasX = (mouseX - offsetRef.current.x) / zoomRef.current;
//     const canvasY = (mouseY - offsetRef.current.y) / zoomRef.current;

//     return { x: canvasX, y: canvasY };
//   };
//   return (
//     <div
//       style={{ height: "100vh", overflow: "hidden" }}
//       className="relative flex justify-center"
//     >
//       {/* Zoom Controls */}
//       <div className="absolute top-4 right-4 z-50 flex flex-col text-black gap-2">
//         <button
//           onClick={zoomIn}
//           className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
//           title="Zoom In (Ctrl/Cmd + +)"
//         >
//           +
//         </button>
//         <button
//           onClick={zoomOut}
//           className="bg-white border border-gray-300 rounded px-3 py-1 shadow hover:bg-gray-50"
//           title="Zoom Out (Ctrl/Cmd + -)"
//         >
//           -
//         </button>
//         <button
//           onClick={resetZoom}
//           className="bg-white border border-gray-300 rounded px-2 py-1 shadow hover:bg-gray-50 text-xs"
//           title="Reset Zoom (Ctrl/Cmd + 0)"
//         >
//           {zoomStatus && Math.round(zoomStatus * 100)}%
//         </button>
//       </div>

//       {activeSidebar && (
//         <div className="absolute flex gap-3 left-4 top-1/2 -translate-y-1/2 z-50">
//           {renderSidebar()}
//         </div>
//       )}

//       <Toolbar changeShape={handleClick} currShape={currShape} />
//       <canvas
//         className={`w-full h-full ${
//           currShape !== "pointer" &&
//           currShape !== "pan" &&
//           currShape !== "eraser"
//             ? "cursor-crosshair"
//             : "cursor-default"
//         }`}
//         ref={canvasRef}
//         width={window.innerWidth}
//         height={window.innerHeight}
//       ></canvas>
//     </div>
//   );
// }

// export default Canvas;

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

  // Mouse + keyboard controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let lastX = 0,
      lastY = 0;

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
