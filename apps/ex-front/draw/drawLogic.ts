import { HTTP_BACKEND } from "@/config";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import { Shape } from "../utils/types";
import { drawArrow, intersectsEraser } from "../utils/drawUtils";
import { getExistingShape } from "../utils/fetchShapes";
import { clearCanvas } from "../utils/clearCanvas";

// Add this flag outside the initDraw function to track active text input
let activeTextInput: HTMLInputElement | null = null;

function hexToRgba(hex: string, alpha: number): string {
  let r = 255,
    g = 255,
    b = 255;
  if (hex.startsWith("#")) {
    const parsed = hex.slice(1);
    if (parsed.length === 3) {
      r = parseInt(parsed[0] + parsed[0], 16);
      g = parseInt(parsed[1] + parsed[1], 16);
      b = parseInt(parsed[2] + parsed[2], 16);
    } else if (parsed.length === 6) {
      r = parseInt(parsed.substring(0, 2), 16);
      g = parseInt(parsed.substring(2, 4), 16);
      b = parseInt(parsed.substring(4, 6), 16);
    }
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper function to get zoom-adjusted values
function getZoomAdjustedValue(value: number, zoom: number): number {
  return value / zoom;
}

export async function drawLogic(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ShapeRef: React.MutableRefObject<string>,
  settingsRef: React.MutableRefObject<any>,
  handleClick: (currShape: string) => void,
  zoomRef: React.RefObject<number>,
  offsetRef: React.RefObject<{
    x: number;
    y: number;
  }>,
  existingShapesRef: React.MutableRefObject<any[]>,
  getCanvasCordinates: (
    e: MouseEvent,
    canvas: HTMLCanvasElement
  ) => {
    x: number;
    y: number;
  }
) {
  const ctx = canvas.getContext("2d");

  if (!ctx)
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };

  let existingShape: Shape[] = await getExistingShape(roomId);
  existingShapesRef.current = existingShape;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape.shape);
      existingShapesRef.current = existingShape; // ← Update ref
      clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
    }

    if (message.type === "deleted") {
      const shapeIdsToDelete = message.message;
      existingShape = existingShape.filter(
        (shape) => !shapeIdsToDelete.includes(shape.shapeId)
      );
      existingShapesRef.current = existingShape; // ← Update ref
      clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
    }
  };

  let deletedShape: Shape[] = [];

  let pencilPoints: { x: number; y: number }[] = [];
  let eraserPoints: { x: number; y: number }[] = [];
  let start = false;
  let startX = 0;
  let startY = 0;

  // Helper function to get current settings
  const getCurrentSettings = () => settingsRef.current;

  function cancelTextInput() {
    if (!ctx)
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    if (!activeTextInput)
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };

    if (activeTextInput.parentNode) {
      activeTextInput.parentNode.removeChild(activeTextInput);
    }
    activeTextInput = null;
    start = false;

    // Redraw canvas
    clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
  }

  clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

  function handleMouseDown(e: MouseEvent) {
    if (!ctx)
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

    ctx.setTransform(
      zoomRef.current,
      0,
      0,
      zoomRef.current,
      offsetRef.current.x,
      offsetRef.current.y
    );
    const coords = getCanvasCordinates(e, canvas);

    function completeTextInput() {
      const ctx = canvas.getContext("2d");
      if (!ctx)
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDown);
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseup", handleMouseUp);
        };
      if (!activeTextInput)
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDown);
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseup", handleMouseUp);
        };

      const input = activeTextInput;
      const inputValue = input.value.trim();

      if (inputValue) {
        const settings = getCurrentSettings();
        ctx.font = `${settings.textFontWeight || "normal"} ${settings.textFontSize || 16}px sans-serif`;
        const textWidth = ctx.measureText(inputValue).width;

        // Get the input box dimensions
        const inputRect = input.getBoundingClientRect();
        const zoom = zoomRef.current || 1;

        // Calculate the input box width in canvas coordinates
        const inputBoxWidth = inputRect.width / zoom;

        let adjustedX = coords.x; // Default for left alignment

        if (settings.textAlign === "center") {
          // For center: text should be in the middle of the input box
          // Start of input box + (input width - text width) / 2
          adjustedX = coords.x + (inputBoxWidth - textWidth) / 2;
        } else if (settings.textAlign === "right") {
          // For right: text should be at the end of the input box
          // Start of input box + (input width - text width)
          adjustedX = coords.x + (inputBoxWidth - textWidth);
        }

        const shape: Shape = {
          type: "text",
          x: adjustedX + 12,
          y: coords.y - 12,
          text: inputValue,
          fontSize: settings.textFontSize,
          textFontWeight: settings.textFontWeight,
          textAlign: settings.textAlign,
          textStrokeColor: settings.textStrokeColor,
          opacity: settings.opacity,
          shapeId: uuidv4(),
          createdAt: Date.now().toString(),
        };

        existingShape.push(shape);

        // Send to socket
        socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId,
          })
        );
      }

      // Clean up input
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
      activeTextInput = null;
      start = false;

      // Redraw canvas
      clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
    }

    // If there's already an active text input, complete it first
    if (activeTextInput) {
      completeTextInput();
    }

    start = true;

    startX = coords.x;
    startY = coords.y;
    if (ShapeRef.current === "pencil") {
      pencilPoints = [{ x: coords.x, y: coords.y }];
    }
    if (ShapeRef.current === "eraser") {
      eraserPoints = [{ x: coords.x, y: coords.y }];
    }
    if (ShapeRef.current === "text") {
      const canvasRect = canvas.getBoundingClientRect();
      const settings = getCurrentSettings();
      const zoom = zoomRef.current || 1;

      const input = document.createElement("input");

      // Store reference to active input
      activeTextInput = input;

      // Calculate screen position from canvas coordinates
      // Convert canvas coordinates to screen coordinates using zoom and offset
      let screenX = coords.x * zoom + offsetRef.current.x + canvasRect.left;
      let screenY = coords.y * zoom + offsetRef.current.y + canvasRect.top;

      // Input styling with proper zoom scaling
      // Use the actual font size (not zoom-adjusted) for the input box display
      const displayFontSize = Math.max(12, settings.textFontSize || 16);
      input.style.fontSize = `${displayFontSize}px`;
      input.style.fontWeight = settings.textFontWeight || "normal";
      input.style.textAlign = settings.textAlign || "left";
      const minInputWidth = Math.max(100, displayFontSize * 6);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (screenX + minInputWidth > viewportWidth) {
        // Position input to the left of the click point
        screenX = Math.max(10, viewportWidth - minInputWidth - 10);
      }

      if (screenY < 10) {
        // Position input below the click point if too close to top
        screenY = screenY + displayFontSize + 10;
      } else if (screenY + displayFontSize + 20 > viewportHeight) {
        // Position input above the click point if too close to bottom
        screenY = Math.max(10, screenY - displayFontSize - 10);
      }

      const rgbaColor = hexToRgba(
        settings.textStrokeColor,
        (settings.opacity ?? 100) / 100
      );
      input.style.color = rgbaColor;

      input.id = "canvas-text-input";
      input.style.position = "fixed";
      input.style.left = `${screenX}px`;
      input.style.top = `${screenY - displayFontSize}px`; // Adjust for baseline
      input.style.border = "1px solid white";
      input.style.minWidth = `${Math.min(300, viewportWidth - screenX - 20)}px`; // Scale min width with font size
      input.style.fontFamily = "sans-serif";
      input.style.fontStyle = "normal";
      input.style.padding = "4px";
      input.style.background = "transparent";
      input.style.zIndex = "9999999";
      input.style.outline = "1px solid #007bff";
      input.style.borderRadius = "3px";
      input.style.boxSizing = "border-box"; // Include padding in width calculation

      // Scale the input box size with zoom for better visibility
      const scaleValue = Math.max(0.8, Math.min(1.2, zoom));
      input.style.transform = `scale(${scaleValue})`;
      input.style.transformOrigin = "left top";
      document.body.appendChild(input);

      // Focus after a small delay

      setTimeout(() => {
        input.focus();
        input.select();
      }, 10);

      // Event listeners for completion
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          completeTextInput();
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          cancelTextInput();
        }
      };

      const handleBlur = (e: FocusEvent) => {
        setTimeout(() => {
          if (activeTextInput === input) {
            completeTextInput();
          }
        }, 100);
      };

      input.addEventListener("keydown", handleKeydown);
      input.addEventListener("blur", handleBlur);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!ctx)
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    ctx.setTransform(
      zoomRef.current,
      0,
      0,
      zoomRef.current,
      offsetRef.current.x,
      offsetRef.current.y
    );
    const settings = getCurrentSettings();
    const coords = getCanvasCordinates(e, canvas);
    const width = coords.x - startX;
    const height = coords.y - startY;

    if (start) {
      if (ShapeRef.current === "rect") {
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

        // Apply zoom-adjusted stroke width
        ctx.lineWidth = getZoomAdjustedValue(
          settings.strokeWidth,
          zoomRef.current
        );
        ctx.strokeStyle = settings.strokeColor;
        ctx.globalAlpha = (settings.opacity ?? 100) / 100;
        if (settings.fillStyle === "fill") {
          ctx.fillStyle = settings.backgroundColor;
          ctx.fillRect(startX, startY, width, height);
          ctx.strokeRect(startX, startY, width, height);
        } else {
          ctx.strokeRect(startX, startY, width, height);
        }
        ctx.globalAlpha = 1.0;
      } else if (ShapeRef.current === "circle") {
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

        // Apply zoom-adjusted stroke width
        ctx.lineWidth = getZoomAdjustedValue(
          settings.strokeWidth,
          zoomRef.current
        );
        ctx.strokeStyle = settings.strokeColor;
        ctx.globalAlpha = (settings.opacity ?? 100) / 100;

        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

        if (settings.fillStyle === "fill") {
          ctx.fillStyle = settings.backgroundColor;
          ctx.fill();
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else if (ShapeRef.current === "pointer") {
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
      } else if (ShapeRef.current === "pencil") {
        pencilPoints.push({ x: coords.x, y: coords.y });
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

        // Apply zoom-adjusted stroke width
        ctx.lineWidth = getZoomAdjustedValue(
          settings.strokeWidth,
          zoomRef.current
        );
        ctx.strokeStyle = settings.strokeColor;
        ctx.globalAlpha = (settings.opacity ?? 100) / 100;

        ctx.beginPath();
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        for (let i = 1; i < pencilPoints.length; i++) {
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else if (ShapeRef.current === "eraser") {
        const newPoint = { x: coords.x, y: coords.y };
        eraserPoints.push(newPoint);

        existingShape = existingShape.filter((shape) => {
          const intersect = intersectsEraser(shape, eraserPoints);
          existingShapesRef.current = existingShape; // ← Update ref

          if (intersect) {
            deletedShape.push(shape);
          }
          return !intersect;
        });
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);
      } else if (ShapeRef.current === "arrow") {
        clearCanvas(existingShape, canvas, ctx, zoomRef, offsetRef);

        ctx.strokeStyle = settings.strokeColor;
        // Apply zoom-adjusted stroke width
        ctx.lineWidth = getZoomAdjustedValue(
          settings.strokeWidth,
          zoomRef.current
        );
        ctx.globalAlpha = (settings.opacity ?? 100) / 100;
        drawArrow(ctx, startX, startY, coords.x, coords.y);
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 1;
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    start = false;

    const coords = getCanvasCordinates(e, canvas);
    const width = coords.x - startX;
    const height = coords.y - startY;
    const settings = getCurrentSettings();

    if (!ctx) return;
    ctx.setTransform(
      zoomRef.current,
      0,
      0,
      zoomRef.current,
      offsetRef.current.x,
      offsetRef.current.y
    );
    if (ShapeRef.current === "text") {
      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
      };
    }
    if (ShapeRef.current === "rect") {
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
        strokeColor: settings.strokeColor,
        backgroundColor: settings.backgroundColor,
        fillStyle: settings.fillStyle,
        strokeWidth: settings.strokeWidth,
        opacity: settings.opacity,
        shapeId: uuidv4(),
        createdAt: Date.now().toString(),
      };

      existingShape.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    } else if (ShapeRef.current === "circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

      const shape: Shape = {
        type: "circle",
        centerX: centerX,
        centerY: centerY,
        radius: radius,
        strokeColor: settings.strokeColor,
        backgroundColor: settings.backgroundColor,
        fillStyle: settings.fillStyle,
        strokeWidth: settings.strokeWidth,
        opacity: settings.opacity,
        shapeId: uuidv4(),
        createdAt: Date.now().toString(),
      };
      existingShape.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    } else if (ShapeRef.current === "pencil") {
      const shape: Shape = {
        type: "pencil",
        points: pencilPoints,
        shapeId: uuidv4(),
        strokeColor: settings.strokeColor,
        strokeWidth: settings.strokeWidth,
        opacity: settings.opacity,
        createdAt: Date.now().toString(),
      };
      existingShape.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    } else if (ShapeRef.current === "eraser") {
      socket.send(
        JSON.stringify({
          type: "deleted",
          message: JSON.stringify({ deletedShape }),
          roomId,
        })
      );
      deletedShape = [];
    } else if (ShapeRef.current === "arrow") {
      const shape: Shape = {
        type: "arrow",
        startX: startX,
        startY: startY,
        endX: coords.x,
        endY: coords.y,
        shapeId: uuidv4(),
        strokeColor: settings.strokeColor,
        strokeWidth: settings.strokeWidth,
        opacity: settings.opacity,
        createdAt: Date.now().toString(),
      };
      existingShape.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    }
  }

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };
}
