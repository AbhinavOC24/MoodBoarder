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

export async function drawLogic(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ShapeRef: React.MutableRefObject<string>,
  settings: any,
  handleClick: (currShape: string) => void
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape.shape);
      clearCanvas(existingShape, canvas, ctx);
    }

    if (message.type === "deleted") {
      // console.log(message.message);
      const shapeIdsToDelete = message.message;
      existingShape = existingShape.filter(
        (shape) => !shapeIdsToDelete.includes(shape.shapeId)
      );
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  let existingShape: Shape[] = await getExistingShape(roomId);
  let deletedShape: Shape[] = [];
  let pencilPoints: { x: number; y: number }[] = [];
  let eraserPoints: { x: number; y: number }[] = [];
  let start = false;
  let startX = 0;
  let startY = 0;
  const {
    textStrokeColor,
    textFontSize,
    textFontWeight,
    textAlign,
    opacity,
    strokeColor,
    backgroundColor,
    fillStyle,
    strokeWidth,
  } = settings;
  function cancelTextInput() {
    if (!ctx) return;
    if (!activeTextInput) return;

    if (activeTextInput.parentNode) {
      activeTextInput.parentNode.removeChild(activeTextInput);
    }
    activeTextInput = null;
    start = false;

    // Redraw canvas
    clearCanvas(existingShape, canvas, ctx);
  }
  // clearCanvas(existingShape, canvas, ctx);

  // Function to complete text input

  // Function to cancel text input
  clearCanvas(existingShape, canvas, ctx);

  function handleMouseDown(e: MouseEvent) {
    if (!ctx) return;
    clearCanvas(existingShape, canvas, ctx);

    function completeTextInput() {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!activeTextInput) return;

      const input = activeTextInput;
      const inputValue = input.value.trim();

      if (inputValue) {
        const canvasRect = canvas.getBoundingClientRect();

        // Calculate text position
        const boxWidth = input.getBoundingClientRect().width;
        ctx.font = `${textFontWeight || "normal"} ${textFontSize || 16}px sans-serif`;
        const textWidth = ctx.measureText(inputValue).width;

        let x = parseInt(input.style.left) - canvasRect.left;
        let y = e.clientY - canvasRect.top;

        if (textAlign === "right") {
          x = x + (boxWidth - textWidth);
        } else if (textAlign === "center") {
          x = x + (boxWidth - textWidth) / 2;
        }

        const shape: Shape = {
          type: "text",
          x,
          y,
          text: inputValue,
          fontSize: textFontSize,
          textFontWeight,
          textAlign,
          textStrokeColor,
          opacity,
          shapeId: uuidv4(),
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
      clearCanvas(existingShape, canvas, ctx);
    }
    // If there's already an active text input, complete it first
    if (activeTextInput) {
      completeTextInput();
    }

    start = true;
    startX = e.clientX;
    startY = e.clientY;

    if (ShapeRef.current === "pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
    if (ShapeRef.current === "eraser") {
      eraserPoints = [{ x: startX, y: startY }];
    }
    if (ShapeRef.current === "text") {
      const canvasRect = canvas.getBoundingClientRect();

      const input = document.createElement("input");
      const {
        textStrokeColor,
        textFontSize,
        textFontWeight,
        textAlign,
        opacity,
      } = settings;

      // Store reference to active input
      activeTextInput = input;

      // Input styling
      input.style.fontSize = `${textFontSize || 16}px`;
      input.style.fontWeight = textFontWeight || "normal";
      input.style.textAlign = textAlign || "left";
      const rgbaColor = hexToRgba(textStrokeColor, (opacity ?? 100) / 100);
      input.style.color = rgbaColor;

      input.id = "canvas-text-input";
      input.style.position = "absolute";
      input.style.left = `${e.clientX}px`;
      input.style.top = `${e.clientY}px`;
      input.style.border = "1px solid white";
      input.style.minWidth = "100px";
      input.style.fontFamily = "sans-serif";
      input.style.fontStyle = "normal";
      input.style.padding = "4px";
      input.style.background = "transparent";
      input.style.zIndex = "9999999";
      input.style.outline = "1px solid #007bff";
      input.style.borderRadius = "3px";

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
        // Small delay to prevent immediate blur when clicking on canvas
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
    if (!ctx) return;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    if (start) {
      if (ShapeRef.current === "rect") {
        clearCanvas(existingShape, canvas, ctx);
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = (opacity ?? 100) / 100;
        if (fillStyle === "fill") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(startX, startY, width, height);
          ctx.strokeRect(startX, startY, width, height);
        } else {
          ctx.strokeRect(startX, startY, width, height);
        }
        ctx.globalAlpha = 1.0;

        // ctx.strokeStyle = "rgb(255,255,255)";
        // ctx?.strokeRect(startX, startY, width, height);
      } else if (ShapeRef.current === "circle") {
        clearCanvas(existingShape, canvas, ctx);
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (ShapeRef.current === "pointer") {
        clearCanvas(existingShape, canvas, ctx);
      } else if (ShapeRef.current === "pencil") {
        pencilPoints.push({ x: e.clientX, y: e.clientY });
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        for (let i = 1; i < pencilPoints.length; i++) {
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }
        ctx.stroke();
      } else if (ShapeRef.current === "eraser") {
        const newPoint = { x: e.clientX, y: e.clientY };
        eraserPoints.push(newPoint);

        existingShape = existingShape.filter((shape) => {
          const intersect = intersectsEraser(shape, eraserPoints);

          if (intersect) {
            deletedShape.push(shape);
          }
          return !intersect;
        });
        clearCanvas(existingShape, canvas, ctx);
      } else if (ShapeRef.current === "arrow") {
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.lineWidth = 2;
        drawArrow(ctx, startX, startY, e.clientX, e.clientY);
        ctx.lineWidth = 1;
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    start = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    if (ShapeRef.current === "text") {
      return;
    }
    if (ShapeRef.current === "rect") {
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
        strokeColor,
        backgroundColor,
        fillStyle,
        strokeWidth,
        opacity,
        shapeId: uuidv4(),
      };
      // console.log("New rect shape added", shape);

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
        shapeId: uuidv4(),
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
        endX: e.clientX,
        endY: e.clientY,
        shapeId: uuidv4(),
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
  let shape: Shape;
  canvas.addEventListener("mouseup", handleMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };
}
