import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { Socket } from "dgram";
import { trackSynchronousPlatformIOAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
import { v4 as uuidv4 } from "uuid";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      shapeId: string;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      shapeId: string;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
      shapeId: string;
    }
  | {
      type: "eraser";
      points: { x: number; y: number }[];
      shapeId: string;
    }
  | {
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      shapeId: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize?: number;
      shapeId: string;
    };

// Helper function to draw an arrow
function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const headLength = 20; // Length of the arrow head
  const angle = Math.atan2(endY - startY, endX - startX);

  // Draw the main line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw the arrow head
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function intersectsEraser(
  shape: Shape,
  eraserPoints: { x: number; y: number }[]
): boolean {
  for (const pt of eraserPoints) {
    if (shape.type === "rect") {
      if (
        pt.x >= shape.x &&
        pt.x <= shape.x + shape.width &&
        pt.y >= shape.y &&
        pt.y <= shape.y + shape.height
      ) {
        return true;
      }
    }
    if (shape.type === "circle") {
      const dx = pt.x - shape.centerX;
      const dy = pt.y - shape.centerY;
      if (Math.sqrt(dx * dx + dy * dy) <= shape.radius) {
        return true;
      }
    }

    if (shape.type === "pencil" || shape.type === "eraser") {
      for (const p of shape.points) {
        const dx = pt.x - p.x;
        const dy = pt.y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 10) return true;
      }
    }

    if (shape.type === "arrow") {
      const minX = Math.min(shape.startX, shape.endX);
      const maxX = Math.max(shape.startX, shape.endX);
      const minY = Math.min(shape.startY, shape.endY);
      const maxY = Math.max(shape.startY, shape.endY);
      if (pt.x >= minX && pt.x <= maxX && pt.y >= minY && pt.y <= maxY) {
        return true;
      }
    }

    if (shape.type === "text") {
      const fontSize = shape.fontSize || 16;
      const textWidth = shape.text.length * fontSize * 0.6;
      if (
        pt.x >= shape.x &&
        pt.x <= shape.x + textWidth &&
        pt.y >= shape.y - fontSize &&
        pt.y <= shape.y
      ) {
        return true;
      }
    }
  }
  return false;
}

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ShapeRef: React.MutableRefObject<string>
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
      const canvasRect = canvas.getBoundingClientRect();

      const input = document.createElement("input");
      input.id = "canvas-text-input";
      input.style.position = "absolute";
      input.style.left = `${e.clientX}px`;
      input.style.top = `${e.clientY}px`;
      input.style.background = "transparent";
      input.style.color = "white";
      input.style.border = "1px solid white";
      input.style.outline = "none";
      input.style.minWidth = "100px";
      input.style.fontFamily = "sans-serif";
      input.style.fontSize = "16px";
      input.style.padding = "4px";
      input.style.zIndex = "1000";

      document.body.appendChild(input);

      setTimeout(() => {
        input.focus();
      }, 10);

      let completed = false;
      const handleComplete = () => {
        // First, reset the drawing state
        start = false;

        if (input.value.trim()) {
          const shape: Shape = {
            type: "text",
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top + 16,
            text: input.value,
            fontSize: 16,
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

          clearCanvas(existingShape, canvas, ctx);
        }
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

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type == "circle") {
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx.beginPath();
      ctx?.arc(
        shape.centerX,
        shape.centerY,
        shape.radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.stroke();
    }
    if (shape.type == "pencil") {
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.stroke();
    }
    // if (shape.type == "eraser") {
    //   ctx.strokeStyle = "rgb(0,0,0)";
    //   ctx.lineWidth = 30;
    //   ctx.beginPath();
    //   ctx.moveTo(shape.points[0].x, shape.points[0].y);
    //   for (let i = 1; i < shape.points.length; i++) {
    //     ctx.lineTo(shape.points[i].x, shape.points[i].y);
    //   }
    //   ctx.stroke();
    //   ctx.lineWidth = 1;
    // }
    if (shape.type == "arrow") {
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx.lineWidth = 2;
      drawArrow(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
      ctx.lineWidth = 1;
    }
    if (shape.type == "text") {
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.font = `${shape.fontSize || 16}px sans-serif`;
      ctx.fillText(shape.text, shape.x, shape.y);
    }
  });
}

async function getExistingShape(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);

  const message = res.data;

  const shapes = message.map((message: any) => {
    const messageData = JSON.parse(message.message);
    return messageData.shape;
  });
  return shapes;
}
