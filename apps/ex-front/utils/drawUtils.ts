import { Shape } from "./types";

export function drawArrow(
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

export function intersectsEraser(
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
