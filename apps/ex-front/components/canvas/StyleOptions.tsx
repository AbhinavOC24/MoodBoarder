"use client";

import { useState } from "react";
import { useDrawingSettings } from "@/stores/StyleOptionStore";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Type,
} from "lucide-react";

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

export function TextDrawingSettingsSidebar() {
  const {
    textStrokeColor,
    setTextStrokeColorByIndex,
    setCustomTextStrokeColor,
    textFontWeight,
    setTextFontWeight,
    textFontSize,
    setTextFontSize,
    textAlign,
    setTextAlign,
    opacity,
    setOpacity,
  } = useDrawingSettings();

  const strokeColors = ["#ffffff", "#d1d5db", "#f87171", "#60a5fa"];
  const fontSizes = ["S", "M", "L", "XL"];
  const fontSizeValues = ["8", "12", "16", "60"];

  const fontStyles = ["normal", "bold", "Serif"];
  const textAlignment = ["left", "center", "right"];

  return (
    <div className="w-52 bg-[#2D2D2D] text-white p-3 font-sans text-sm rounded-lg">
      {/* Stroke */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Stroke</h3>
        <div className="flex gap-1 flex-wrap">
          {strokeColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setTextStrokeColorByIndex(index)}
              className={`w-8 h-8 rounded-md border`}
              style={{
                backgroundColor: color,
                borderColor: textStrokeColor === color ? "white" : "gray",
              }}
            />
          ))}
          <div className="relative">
            <button
              className={`w-8 h-8 rounded-md border ${
                !strokeColors.includes(textStrokeColor)
                  ? "border-white"
                  : "border-gray-600"
              }`}
              style={{ backgroundColor: textStrokeColor }}
            />
            <input
              type="color"
              value={textStrokeColor}
              onChange={(e) => setCustomTextStrokeColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label="Custom stroke color"
            />
          </div>
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Font Family</h3>
        <div className="flex gap-1">
          {fontStyles.map((style, index) => (
            <button
              key={index}
              onClick={() => setTextFontWeight(index)}
              className={`w-8 h-8 rounded-md border ${
                textFontWeight === fontStyles[index]
                  ? "border-white bg-indigo-600"
                  : "border-gray-600 bg-gray-700"
              } flex items-center justify-center ${
                style === "serif" ? "font-serif" : ""
              }`}
            >
              {style === "normal" && <Type size={14} />}
              {style === "bold" && <Bold size={14} />}
              {style === "Serif" && (
                <span className="text-xs font-bold ">A</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Font Size</h3>
        <div className="flex gap-1">
          {fontSizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setTextFontSize(index)}
              className={`w-8 h-8 rounded-md border ${
                textFontSize === fontSizeValues[index]
                  ? "border-white bg-indigo-600"
                  : "border-gray-600 bg-gray-700"
              } flex items-center justify-center text-xs font-medium`}
            >
              {fontSizes[index]}
            </button>
          ))}
        </div>
      </div>

      {/* Text Align */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Text Align</h3>
        <div className="flex gap-1">
          {[AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
            <button
              key={index}
              onClick={() => setTextAlign(index)}
              className={`w-8 h-8 rounded-md border ${
                textAlign === textAlignment[index]
                  ? "border-white bg-indigo-600"
                  : "border-gray-600 bg-gray-700"
              } flex items-center justify-center`}
            >
              <Icon size={14} />
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
