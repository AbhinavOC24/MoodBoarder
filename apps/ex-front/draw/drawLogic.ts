import { HTTP_BACKEND } from "@/config";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import { Shape } from "../utils/types";
import { drawArrow, intersectsEraser } from "../utils/drawUtils";
import { getExistingShape } from "../utils/fetchShapes";
import { clearCanvas } from "../utils/clearCanvas";
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

export async function initDraw(
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
      console.log(message.message);
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

  clearCanvas(existingShape, canvas, ctx);

  canvas.addEventListener("mousedown", (e) => {
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
      // clearCanvas(existingShape, canvas, ctx);

      const canvasRect = canvas.getBoundingClientRect();

      const input = document.createElement("input");
      const {
        textStrokeColor,
        textFontSize,
        textFontWeight,
        textAlign,
        opacity,
      } = settings;

      // console.log("from drawlogic", textFontWeight);
      // input.style.color = `${textStrokeColor}`;
      input.style.fontSize = `${textFontSize || 16}px`;
      input.style.fontWeight = textFontWeight || "normal";
      input.style.textAlign = textAlign || "left";
      const rgbaColor = hexToRgba(textStrokeColor, (opacity ?? 100) / 100);
      input.style.color = rgbaColor;

      input.id = "canvas-text-input";
      input.style.position = "absolute";
      input.style.left = `${e.clientX}px`;
      input.style.top = `${e.clientY}px`;
      // input.style.background = "transparent";
      input.style.border = "1px solid white";
      // input.style.outline = "none";
      input.style.minWidth = "100px";
      input.style.fontFamily = "sans-serif";
      input.style.fontStyle = "normal";
      input.style.padding = "4px";

      input.style.background = "rgba(255, 0, 0, 0.2)";
      input.style.zIndex = "9999999";
      input.style.outline = "1px solid red";

      document.body.appendChild(input);

      setTimeout(() => {
        input.focus();
      }, 10);

      let completed = false;
      const handleComplete = () => {
        // First, reset the drawing state
        start = false;

        if (input.value.trim() && !completed) {
          const boxWidth = input.getBoundingClientRect().width;
          const textWidth = ctx.measureText(input.value).width;

          let x = e.clientX - canvasRect.left;
          if (textAlign === "right") {
            x = x + (boxWidth - textWidth);
          } else if (textAlign === "center") {
            x = x + (boxWidth - textWidth) / 2;
          }
          ctx.textBaseline = "top";

          const shape: Shape = {
            type: "text",
            x,
            y: e.clientY - canvasRect.top,
            text: input.value,
            fontSize: textFontSize,
            textFontWeight,
            textAlign,
            textStrokeColor,
            opacity,
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

        if (input.parentNode && !completed) {
          completed = true;
          input.parentNode.removeChild(input);
        }

        clearCanvas(existingShape, canvas, ctx);
      };

      input.addEventListener("blur", handleComplete);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleComplete();
        }
      });
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    if (start) {
      if (ShapeRef.current === "rect") {
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx?.strokeRect(startX, startY, width, height);
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
        // ctx.strokeStyle = "rgb(0,0,0)";
        // ctx.lineWidth = 30;
        // ctx.beginPath();
        // ctx.moveTo(eraserPoints[0].x, eraserPoints[0].y);
        // for (let i = 1; i < eraserPoints.length; i++) {
        //   ctx.lineTo(eraserPoints[i].x, eraserPoints[i].y);
        // }
        // ctx.stroke();
        // ctx.lineWidth = 1;
      } else if (ShapeRef.current === "arrow") {
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.lineWidth = 2;
        drawArrow(ctx, startX, startY, e.clientX, e.clientY);
        ctx.lineWidth = 1;
      }
    }
  });
  let shape: Shape;
  canvas.addEventListener("mouseup", (e) => {
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
      // const shape: Shape = {
      //   type: "eraser",
      //   points: eraserPoints,
      // };
      // existingShape.push(shape);

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
  });
}
