import { Shape } from "./types";
import { drawArrow } from "./drawUtils";

export function clearCanvas(
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
