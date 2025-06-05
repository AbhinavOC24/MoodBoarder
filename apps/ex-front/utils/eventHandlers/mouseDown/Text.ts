import { Shape } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { clearCanvas } from "../../clearCanvas";

export function mouseDownText(
  canvas: HTMLCanvasElement,
  e: MouseEvent,
  start: boolean,
  socket: WebSocket,
  roomId: string,
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[]
) {
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
    if (completed) return;
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
