"use client";

import { useState } from "react";
import { useDrawingSettings } from "@/stores/StyleOptionStore";

export function Component() {
  const [selectedStroke, setSelectedStroke] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(3);
  const [selectedFill, setSelectedFill] = useState(2);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(1);
  const [selectedStrokeStyle, setSelectedStrokeStyle] = useState(0);
  const [selectedSloppiness, setSelectedSloppiness] = useState(0);
  const [selectedEdges, setSelectedEdges] = useState(1);
  const [opacity, setOpacity] = useState(100);

  const [customStrokeColor, setCustomStrokeColor] = useState("#ffffff");
  const [customBackgroundColor, setCustomBackgroundColor] = useState("#3b82f6");

  const strokeColors = ["bg-white", "bg-gray-300", "bg-red-400", "bg-blue-400"];

  const backgroundColors = [
    "bg-white",
    "bg-gray-400",
    "bg-red-900",
    "bg-green-700",
  ];

  return (
    <div className="w-52 bg-[#2D2D2D] text-white p-3 font-sans text-sm rounded-lg">
      {/* Stroke */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke</h3>
        <div className="flex gap-1 flex-wrap">
          {strokeColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedStroke(index)}
              className={`w-8 h-8 rounded-md ${color} border ${
                selectedStroke === index ? "border-white" : "border-gray-600"
              }`}
            />
          ))}
          <div className="relative">
            <button
              onClick={() => setSelectedStroke(5)}
              className={`w-8 h-8 rounded-md border ${selectedStroke === 5 ? "border-white" : "border-gray-600"}`}
              style={{ backgroundColor: customStrokeColor }}
            />
            <input
              type="color"
              value={customStrokeColor}
              onChange={(e) => {
                setCustomStrokeColor(e.target.value);
                setSelectedStroke(5);
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Custom stroke color"
            />
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Background</h3>
        <div className="flex gap-1 flex-wrap">
          {backgroundColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedBackground(index)}
              className={`w-8 h-8 rounded-md ${color} border ${
                selectedBackground === index
                  ? "border-white"
                  : "border-gray-600"
              }`}
            />
          ))}
          <div className="relative">
            <button
              onClick={() => setSelectedBackground(5)}
              className={`w-8 h-8 rounded-md border ${selectedBackground === 5 ? "border-white" : "border-gray-600"}`}
              style={{ backgroundColor: customBackgroundColor }}
            />
            <input
              type="color"
              value={customBackgroundColor}
              onChange={(e) => {
                setCustomBackgroundColor(e.target.value);
                setSelectedBackground(5);
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Custom background color"
            />
          </div>
        </div>
      </div>

      {/* Fill */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Fill</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedFill(0)}
            className={`w-8 h-8 rounded-md border ${
              selectedFill === 0
                ? "border-white bg-indigo-600"
                : "border-gray-600 bg-gray-700"
            } flex items-center justify-center`}
          >
            <div
              className={`w-5 h-5 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-45 ${
                selectedFill === 0 ? "opacity-80" : "opacity-20"
              }`}
            ></div>
          </button>
          {/* <button
            onClick={() => setSelectedFill(1)}
            className={`w-8 h-8 rounded-md border ${
              selectedFill === 1
                ? "border-white bg-indigo-600"
                : "border-gray-600 bg-gray-700"
            } flex items-center justify-center`}
          >
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 h-0.5 bg-white rounded-full ${selectedFill === 1 ? "opacity-100" : "opacity-60"}`}
                ></div>
              ))}
            </div>
          </button> */}
          <button
            onClick={() => setSelectedFill(2)}
            className={`w-8 h-8 rounded-md border ${
              selectedFill === 2
                ? "border-white bg-indigo-600"
                : "border-gray-600 bg-gray-700"
            } flex items-center justify-center`}
          >
            <div className="w-4 h-4 bg-white rounded"></div>
          </button>
        </div>
      </div>

      {/* Stroke width */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke width</h3>
        <div className="flex gap-1">
          {[1, 2, 3].map((width, index) => (
            <button
              key={index}
              onClick={() => setSelectedStrokeWidth(index)}
              className={`w-8 h-8 rounded-md bg-gray-700 border ${
                selectedStrokeWidth === index
                  ? "border-white bg-indigo-600"
                  : "border-gray-600"
              } flex items-center justify-center`}
            >
              <div
                className="bg-white rounded-full"
                style={{
                  width: "16px",
                  height: `${width}px`,
                }}
              ></div>
            </button>
          ))}
        </div>
      </div>

      {/* Stroke style */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke style</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedStrokeStyle(0)}
            className={`w-8 h-8 rounded-md bg-gray-700 border ${
              selectedStrokeStyle === 0
                ? "border-white bg-indigo-600"
                : "border-gray-600"
            } flex items-center justify-center`}
          >
            <div className="w-4 h-0.5 bg-white"></div>
          </button>
          <button
            onClick={() => setSelectedStrokeStyle(1)}
            className={`w-8 h-8 rounded-md bg-gray-700 border ${
              selectedStrokeStyle === 1
                ? "border-white bg-indigo-600"
                : "border-gray-600"
            } flex items-center justify-center`}
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-0.5 bg-white"></div>
              <div className="w-0.5 h-0.5 bg-white"></div>
              <div className="w-0.5 h-0.5 bg-white"></div>
            </div>
          </button>
          <button
            onClick={() => setSelectedStrokeStyle(2)}
            className={`w-8 h-8 rounded-md bg-gray-700 border ${
              selectedStrokeStyle === 2
                ? "border-white bg-indigo-600"
                : "border-gray-600"
            } flex items-center justify-center`}
          >
            <div className="flex gap-0.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 h-0.5 bg-white rounded-full"
                ></div>
              ))}
            </div>
          </button>
        </div>
      </div> */}

      {/* Sloppiness */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Sloppiness</h3>
        <div className="flex gap-1">
          {[0, 1, 2].map((level, index) => (
            <button
              key={index}
              onClick={() => setSelectedSloppiness(index)}
              className={`w-8 h-8 rounded-md bg-gray-700 border ${
                selectedSloppiness === index
                  ? "border-white bg-indigo-600"
                  : "border-gray-600"
              } flex items-center justify-center`}
            >
              <svg
                width="16"
                height="6"
                viewBox="0 0 16 6"
                className="text-white"
              >
                <path
                  d={
                    level === 0
                      ? "M2 3 L14 3"
                      : level === 1
                        ? "M2 3 Q6 2 8 3 T14 3"
                        : "M2 3 Q4 1 6 3 Q8 5 10 2 Q12 1 14 3"
                  }
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </button>
          ))}
        </div>
      </div> */}

      {/* Edges */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Edges</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedEdges(0)}
            className={`w-8 h-8 rounded-md bg-gray-700 border ${
              selectedEdges === 0
                ? "border-white bg-indigo-600"
                : "border-gray-600"
            } flex items-center justify-center`}
          >
            <div className="w-4 h-4 border border-white border-dashed"></div>
          </button>
          <button
            onClick={() => setSelectedEdges(1)}
            className={`w-8 h-8 rounded-md bg-gray-700 border ${
              selectedEdges === 1
                ? "border-white bg-indigo-600"
                : "border-gray-600"
            } flex items-center justify-center`}
          >
            <div className="w-4 h-4 border border-white rounded"></div>
          </button>
        </div>
      </div> */}

      {/* Opacity */}
      <div>
        <h3 className="text-sm font-medium mb-2">Opacity</h3>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1.5 bg-indigo-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #6b7280;
          cursor: pointer;
          border: 2px solid #374151;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #6b7280;
          cursor: pointer;
          border: 2px solid #374151;
        }
      `}</style>
    </div>
  );
}

const strokeColors = ["#ffffff", "#d1d5db", "#f87171", "#60a5fa"];

const backgroundColors = ["#ffffff", "#9ca3af", "#7f1d1d", "#15803d"];

export function DrawingSettingsSidebar() {
  const {
    strokeColor,
    setStrokeColorByIndex,
    setCustomStrokeColor,
    backgroundColor,
    setBackgroundColorByIndex,
    setCustomBackgroundColor,
    fillStyle,
    setFillStyle,
    strokeWidth,
    setStrokeWidth,
    opacity,
    setOpacity,
  } = useDrawingSettings();

  return (
    <div className="w-52 bg-[#2D2D2D] text-white p-3 font-sans text-sm rounded-lg">
      {/* Stroke Color */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke</h3>
        <div className="flex gap-1 flex-wrap">
          {strokeColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setStrokeColorByIndex(index)}
              className={`w-8 h-8 rounded-md border ${
                strokeColor === color ? "border-white" : "border-gray-600"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {/* Custom stroke color input */}
          <div className="relative">
            <button
              className={`w-8 h-8 rounded-md border ${
                !strokeColors.includes(strokeColor)
                  ? "border-white"
                  : "border-gray-600"
              }`}
              style={{ backgroundColor: strokeColor }}
            />
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setCustomStrokeColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Custom stroke color"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Background</h3>
        <div className="flex gap-1 flex-wrap">
          {backgroundColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setBackgroundColorByIndex(index)}
              className={`w-8 h-8 rounded-md border ${
                backgroundColor === color ? "border-white" : "border-gray-600"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {/* Custom background color input */}
          <div className="relative">
            <button
              className={`w-8 h-8 rounded-md border ${
                !backgroundColors.includes(backgroundColor)
                  ? "border-white"
                  : "border-gray-600"
              }`}
              style={{ backgroundColor: backgroundColor }}
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setCustomBackgroundColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Custom background color"
            />
          </div>
        </div>
      </div>

      {/* Fill Style */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Fill Style</h3>
        <div className="flex gap-1">
          {/* {["no fill", "solid"].map((style, index) => (
            <button
              key={index}
              onClick={() => setFillStyle(index)}
              className={`w-8 h-8 rounded-md border ${
                fillStyle === style
                  ? "border-white bg-indigo-600"
                  : "border-gray-600 bg-gray-700"
              } flex items-center justify-center`}
            >
              <div className="w-4 h-4 bg-white rounded"></div>
            </button>
          ))} */}
          <button
            onClick={() => setFillStyle(0)}
            className={`w-8 h-8 rounded-md border ${
              fillStyle === "no fill"
                ? "border-white bg-indigo-600"
                : "border-gray-600 bg-gray-700"
            } flex items-center justify-center`}
          >
            <div
              className={`w-5 h-5 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-45 ${
                fillStyle === "no fill" ? "opacity-80" : "opacity-20"
              }`}
            ></div>
          </button>
          <button
            onClick={() => setFillStyle(1)}
            className={`w-8 h-8 rounded-md border ${
              fillStyle === "solid"
                ? "border-white bg-indigo-600"
                : "border-gray-600 bg-gray-700"
            } flex items-center justify-center`}
          >
            <div className="w-4 h-4 bg-white rounded"></div>
          </button>
        </div>
      </div>

      {/* Stroke Width */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke Width</h3>
        <div className="flex gap-1">
          {[1, 2, 4].map((width, index) => (
            <button
              key={index}
              onClick={() => setStrokeWidth(index)}
              className={`w-8 h-8 rounded-md bg-gray-700 border ${
                strokeWidth === width
                  ? "border-white bg-indigo-600"
                  : "border-gray-600"
              } flex items-center justify-center`}
            >
              <div
                className="bg-white rounded-full"
                style={{
                  width: "16px",
                  height: `${width}px`,
                }}
              ></div>
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <h3 className="text-sm font-medium mb-2">Opacity</h3>

        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
