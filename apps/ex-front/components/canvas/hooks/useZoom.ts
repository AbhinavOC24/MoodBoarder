import { useRef } from "react";

export interface ZoomRefs {
  zoomRef: React.MutableRefObject<number>;
  offsetRef: React.MutableRefObject<{ x: number; y: number }>;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const useZoom = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  redraw: () => void
): ZoomRefs => {
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  const zoomIn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const currentZoom = zoomRef.current;
    const newZoom = Math.min(10, currentZoom * 1.2);
    zoomRef.current = newZoom;

    offsetRef.current.x =
      centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y =
      centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  };

  const zoomOut = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const currentZoom = zoomRef.current;
    const newZoom = Math.max(0.1, currentZoom / 1.2);
    zoomRef.current = newZoom;

    offsetRef.current.x =
      centerX - ((centerX - offsetRef.current.x) / currentZoom) * newZoom;
    offsetRef.current.y =
      centerY - ((centerY - offsetRef.current.y) / currentZoom) * newZoom;

    redraw();
  };

  const resetZoom = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    zoomRef.current = 1;
    offsetRef.current = { x: 0, y: 0 };
    redraw();
  };

  return {
    zoomRef,
    offsetRef,
    zoomIn,
    zoomOut,
    resetZoom,
  };
};
