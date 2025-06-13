import { Shape } from "./types";
import { drawArrow } from "./drawUtils";
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

export function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  // console.log("Existing shape from clear canvas", existingShape);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log(existingShape);
  existingShape.forEach((shape) => {
    if (shape.type === "rect") {
      const {
        strokeWidth,
        strokeColor,
        opacity,
        fillStyle,
        backgroundColor,
        x,
        y,
        width,
        height,
      } = shape;
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = (opacity ?? 100) / 100;
      if (fillStyle === "fill") {
        ctx.fillStyle = backgroundColor;
        // console.log(backgroundColor);
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
      ctx.globalAlpha = 1.0;
      // console.log("New rect shape from clearCanvas", shape);

      // ctx.strokeStyle = "rgb(255,255,255)";
      // ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
      ctx.fillStyle = hexToRgba(shape.textStrokeColor, shape.opacity / 100);

      const fontWeight = shape.textFontWeight || "normal";

      ctx.font = `${fontWeight} ${shape.fontSize}px sans-serif`;

      // console.log("from clear canvas", shape.textAlign); fixed

      ctx.textAlign = (shape.textAlign ?? "left") as CanvasTextAlign;

      ctx.fillText(shape.text, shape.x, shape.y);
    }
  });
}
