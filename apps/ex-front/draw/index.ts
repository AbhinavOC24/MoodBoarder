import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { Socket } from "dgram";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    }
  | {
      type: "eraser";
      points: { x: number; y: number }[];
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ShapeRef: React.MutableRefObject<string>
) {
  const ctx = canvas.getContext("2d");
  let existingShape: Shape[] = await getExistingShape(roomId);

  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape.shape);
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  clearCanvas(existingShape, canvas, ctx);

  let start = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];
  let eraserPoints: { x: number; y: number }[] = [];

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
        eraserPoints.push({ x: e.clientX, y: e.clientY });
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 30; // Increase this value for a thicker eraser
        ctx.beginPath();
        ctx.moveTo(eraserPoints[0].x, eraserPoints[0].y);
        for (let i = 1; i < eraserPoints.length; i++) {
          ctx.lineTo(eraserPoints[i].x, eraserPoints[i].y);
        }
        ctx.stroke();
        ctx.lineWidth = 1; // Reset for other tools
      }
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    start = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    if (ShapeRef.current === "rect") {
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
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
      const shape: Shape = {
        type: "eraser",
        points: eraserPoints,
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
    if (shape.type == "eraser") {
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.lineWidth = 30; // Match the eraser thickness here as well
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.stroke();
      ctx.lineWidth = 1; // Reset for other tools
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
