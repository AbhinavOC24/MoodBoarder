export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      shapeId: string;
      strokeColor: string;
      backgroundColor: string;
      fillStyle: string;
      strokeWidth: number;
      opacity: number;
      createdAt: string;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      shapeId: string;
      createdAt: string;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
      shapeId: string;
      createdAt: string;
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
      createdAt: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize?: number;
      textFontWeight: string;
      textAlign: string;
      textStrokeColor: string;
      opacity: number;
      shapeId: string;
      createdAt: string;
    };
