import { create } from "zustand";

interface DrawingSettingsState {
  // General Drawing
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

  // Text Specific
  textStrokeColor: string;
  setTextStrokeColorByIndex: (index: number) => void;
  setCustomTextStrokeColor: (color: string) => void;

  textFontWeight: string;
  setTextFontWeight: (index: number) => void;

  textFontSize: string;
  setTextFontSize: (index: number) => void;

  textAlign: string;
  setTextAlign: (index: number) => void;
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

const fontSizes = ["8", "12", "16", "60"];
const fontStyle = ["normal", "bold"];
const textAlignment = ["left", "center", "right"];

export const useDrawingSettings = create<DrawingSettingsState>((set, get) => ({
  // General Drawing
  strokeColor: strokeColors[0],
  backgroundColor: backgroundColors[3],
  fillStyle: fillStyle[0],
  strokeWidth: strokeWidth[0],
  opacity: 100,

  setStrokeColorByIndex: (index) => {
    set({ strokeColor: strokeColors[index] });
    console.log("✅ Stroke color set:", get().strokeColor);
  },
  setCustomStrokeColor: (color) => {
    set({ strokeColor: color });
    console.log("✅ Custom stroke color set:", get().strokeColor);
  },

  setBackgroundColorByIndex: (index) => {
    set({ backgroundColor: backgroundColors[index] });
    console.log("✅ Background color set:", get().backgroundColor);
  },
  setCustomBackgroundColor: (color) => {
    set({ backgroundColor: color });
    console.log("✅ Custom background color set:", get().backgroundColor);
  },

  setFillStyle: (index) => {
    set({ fillStyle: fillStyle[index] });
    console.log("✅ Fill style set:", get().fillStyle);
  },

  setStrokeWidth: (index) => {
    set({ strokeWidth: strokeWidth[index] });
    console.log("✅ Stroke width set:", get().strokeWidth);
  },

  setOpacity: (value) => {
    set({ opacity: value });
    console.log("✅ Opacity set:", get().opacity);
  },

  // Text-Specific Drawing
  textStrokeColor: strokeColors[0],
  textFontWeight: fontStyle[0],
  textAlign: textAlignment[0],
  textFontSize: fontSizes[0],

  setTextStrokeColorByIndex: (index) => {
    set({ textStrokeColor: strokeColors[index] });
    console.log("📝 Text stroke color set:", get().textStrokeColor);
  },
  setCustomTextStrokeColor: (color) => {
    set({ textStrokeColor: color });
    console.log("📝 Custom text stroke color set:", get().textStrokeColor);
  },

  setTextFontWeight: (index) => {
    set({ textFontWeight: fontStyle[index] });
    console.log("📝 Font weight set:", get().textFontWeight);
  },

  setTextFontSize: (index) => {
    set({ textFontSize: fontSizes[index] });
    console.log("📝 Font size set:", get().textFontSize);
  },

  setTextAlign: (index) => {
    set({ textAlign: textAlignment[index] });
    console.log("📝 Text align set:", get().textAlign);
  },
}));
