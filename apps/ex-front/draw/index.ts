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
    }
  | {
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize?: number;
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

  // Remove any existing text input when clicking elsewhere
  const removeExistingTextInput = () => {
    const existingInput = document.getElementById("canvas-text-input");
    if (existingInput && existingInput.parentNode) {
      existingInput.parentNode.removeChild(existingInput);
    }
  };

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
      // First remove any existing text input
      // removeExistingTextInput();

      // Get canvas position for accurate positioning
      const canvasRect = canvas.getBoundingClientRect();

      // Create a temporary input element for text entry
      const input = document.createElement("input");
      input.id = "canvas-text-input"; // Add ID for easy reference
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

      // Add to document body
      document.body.appendChild(input);

      // Focus after a small delay to ensure it's rendered
      setTimeout(() => {
        input.focus();
      }, 10);

      // Handle text completion
      let completed = false;
      const handleComplete = () => {
        if (input.value.trim()) {
          const shape: Shape = {
            type: "text",
            x: e.clientX - canvasRect.left, // Convert to canvas coordinates
            y: e.clientY - canvasRect.top + 16, // Add offset for text baseline
            text: input.value,
            fontSize: 16,
          };

          existingShape.push(shape);
          socket.send(
            JSON.stringify({
              type: "chat",
              message: JSON.stringify({ shape }),
              roomId,
            })
          );

          clearCanvas(existingShape, canvas, ctx);
        }

        // Remove the input element

        if (input.parentNode && !completed) {
          completed = true;
          input.parentNode.removeChild(input);
        }
      };

      // Set up event listeners
      input.addEventListener("blur", handleComplete);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent default to avoid form submission
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
        eraserPoints.push({ x: e.clientX, y: e.clientY });
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.moveTo(eraserPoints[0].x, eraserPoints[0].y);
        for (let i = 1; i < eraserPoints.length; i++) {
          ctx.lineTo(eraserPoints[i].x, eraserPoints[i].y);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      } else if (ShapeRef.current === "arrow") {
        clearCanvas(existingShape, canvas, ctx);
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.lineWidth = 2;
        drawArrow(ctx, startX, startY, e.clientX, e.clientY);
        ctx.lineWidth = 1;
      }
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    start = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    // Skip text handling in mouseup since it's handled in the input's events
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
    } else if (ShapeRef.current === "arrow") {
      const shape: Shape = {
        type: "arrow",
        startX: startX,
        startY: startY,
        endX: e.clientX,
        endY: e.clientY,
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
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    }
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
