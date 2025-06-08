import { create } from "zustand";

interface DrawingSettingsState {
  strokeColor: string;
  setStrokeColorByIndex: (index: number) => void;
  setCustomStrokeColor: (color: string) => void;

  backgroundColor: string;
  setBackgroundColorByIndex: (index: number) => void;
  setCustomBackgroundColor: (color: string) => void;

  fillStyle: string;
  setFillStyle: (index: number) => void;

  strokeWidth: number;
  setStrokeWidth: (index: number) => void;

  opacity: number;
  setOpacity: (value: number) => void;
}

const strokeColors = [
  "#ffffff", // white
  "#d1d5db", // gray-300
  "#f87171", // red-400
  "#60a5fa", // blue-400
];

const backgroundColors = [
  "#ffffff", // white
  "#9ca3af", // gray-400
  "#7f1d1d", // red-900
  "#15803d", // green-700
];

const fillStyle = ["no fill", "solid"];

const strokeWidth = [1, 2, 4];

//   // Stroke
//   strokeColor: strokeColors[0],
//   setStrokeColorByIndex: (index: number) => {
//     set({ strokeColor: strokeColors[index] });
//     console.log(strokeColors);
//   },
//   setCustomStrokeColor: (color: string) => {
//     set({ strokeColor: color });
//     console.log(strokeColors);
//   },

//   // Background
//   backgroundColor: backgroundColors[3],
//   setBackgroundColorByIndex: (index: number) => {
//     set({ backgroundColor: backgroundColors[index] });
//     console.log(backgroundColors);
//   },
//   setCustomBackgroundColor: (color: string) => {
//     set({ backgroundColor: color });
//     console.log(backgroundColors);
//   },

//   // Fill
//   fillStyle: fillStyle[0], // or "transparent" etc.
//   setFillStyle: (index: number) => {
//     set({ fillStyle: fillStyle[index] });
//     console.log(fillStyle);
//   },

//   // Stroke width
//   strokeWidth: strokeWidth[0],
//   setStrokeWidth: (index: number) => {
//     set({ strokeWidth: strokeWidth[index] });
//     console.log(strokeWidth);
//   },

//   // Opacity
//   opacity: 100,
//   setOpacity: (value: number) => {
//     set({ opacity: value });
//   },
// }));
export const useDrawingSettings = create<DrawingSettingsState>((set, get) => ({
  // Stroke
  strokeColor: strokeColors[0],
  setStrokeColorByIndex: (index: number) => {
    const color = strokeColors[index];
    set({ strokeColor: color });
    console.log("✅ Stroke color set by index:", get().strokeColor);
  },
  setCustomStrokeColor: (color: string) => {
    set({ strokeColor: color });
    console.log("✅ Custom stroke color set:", get().strokeColor);
  },

  // Background
  backgroundColor: backgroundColors[3],
  setBackgroundColorByIndex: (index: number) => {
    const color = backgroundColors[index];
    set({ backgroundColor: color });
    console.log("✅ Background color set by index:", get().backgroundColor);
  },
  setCustomBackgroundColor: (color: string) => {
    set({ backgroundColor: color });
    console.log("✅ Custom background color set:", get().backgroundColor);
  },

  // Fill
  fillStyle: fillStyle[0],
  setFillStyle: (index: number) => {
    set({ fillStyle: fillStyle[index] });
    console.log("✅ Fill style set:", get().fillStyle);
  },

  // Stroke width
  strokeWidth: strokeWidth[0],
  setStrokeWidth: (index: number) => {
    set({ strokeWidth: strokeWidth[index] });
    console.log("✅ Stroke width set:", get().strokeWidth);
  },

  // Opacity
  opacity: 100,
  setOpacity: (value: number) => {
    set({ opacity: value });
    console.log("✅ Opacity set:", get().opacity);
  },
}));
