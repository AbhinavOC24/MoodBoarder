import { useEffect } from "react";
import { ZoomRefs } from "./useZoom";

interface UseCanvasEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  shapeRef: React.MutableRefObject<string>;
  zoomRefs: ZoomRefs;
  redraw: () => void;
}

export const useCanvasEvents = ({
  canvasRef,
  shapeRef,
  zoomRefs,
  redraw,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomIntensity = 0.1;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentZoom = zoomRefs.zoomRef.current;
      const newZoom =
        e.deltaY < 0
          ? currentZoom * (1 + zoomIntensity)
          : currentZoom * (1 - zoomIntensity);
      zoomRefs.zoomRef.current = Math.max(0.1, Math.min(10, newZoom));

      zoomRefs.offsetRef.current.x =
        mouseX -
        ((mouseX - zoomRefs.offsetRef.current.x) / currentZoom) * newZoom;
      zoomRefs.offsetRef.current.y =
        mouseY -
        ((mouseY - zoomRefs.offsetRef.current.y) / currentZoom) * newZoom;

      redraw();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (shapeRef.current === "hand") {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (shapeRef.current === "hand" && !isDragging) {
        canvas.style.cursor = "grab";
      } else if (shapeRef.current !== "hand") {
        canvas.style.cursor = "default";
      }

      if (!isDragging || shapeRef.current !== "hand") return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      zoomRefs.offsetRef.current.x += dx;
      zoomRefs.offsetRef.current.y += dy;
      lastX = e.clientX;
      lastY = e.clientY;
      redraw();
    };

    const handleMouseUp = () => {
      if (isDragging && shapeRef.current === "hand") {
        canvas.style.cursor = "grab";
      }
      isDragging = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomRefs.zoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomRefs.zoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        zoomRefs.resetZoom();
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef, shapeRef, zoomRefs, redraw]);
};
