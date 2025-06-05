// import React from "react";
// import IconButton from "./IconButton";
// import {
//   Square,
//   Circle,
//   MousePointer2,
//   Pencil,
//   Eraser,
//   ArrowUpRight,
//   Type,
// } from "lucide-react";

// function Toolbar({ changeShape, currShape }: ToolbarProps) {
//   return (
//     <div className="absolute top-0 left-0 flex flex-col gap-3 p-2">
//       <IconButton
//         Icon={<Square />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="rect"
//       />
//       <IconButton
//         Icon={<Circle />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="circle"
//       />
//       <IconButton
//         Icon={<MousePointer2 />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="pointer"
//       />
//       <IconButton
//         Icon={<Pencil />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="pencil"
//       />
//       <IconButton
//         Icon={<Eraser />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="eraser"
//       />
//       <IconButton
//         Icon={<ArrowUpRight />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="arrow"
//       />
//       <IconButton
//         Icon={<Type />}
//         changeShape={changeShape}
//         currShape={currShape}
//         value="text"
//       />
//     </div>
//   );
// }

// export default Toolbar;

import type React from "react";
import { useState } from "react";
import {
  Hand,
  MousePointer2,
  Diamond,
  Circle,
  ArrowRight,
  Pen,
  Type,
  ImageIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface ToolbarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  label: string;
}
interface ToolbarProps {
  changeShape: (e: string) => void;
  currShape: string;
}

const toolbarItems: ToolbarItem[] = [
  { id: "hand", icon: Hand, shortcut: "1", label: "Hand Tool" },
  {
    id: "pointer",
    icon: MousePointer2,
    shortcut: "2",
    label: "Selection Tool",
  },
  { id: "rect", icon: Diamond, shortcut: "3", label: "Shape Tool" },
  { id: "circle", icon: Circle, shortcut: "4", label: "Circle Tool" },
  { id: "arrow", icon: ArrowRight, shortcut: "5", label: "Arrow Tool" },
  { id: "pencil", icon: Pen, shortcut: "6", label: "Pen Tool" },
  { id: "text", icon: Type, shortcut: "7", label: "Text Tool" },
  { id: "image", icon: ImageIcon, shortcut: "8", label: "Image Tool" },
];

export default function Toolbar({ changeShape }: ToolbarProps) {
  const [selectedTool, setSelectedTool] = useState("pointer");

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    changeShape(toolId);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;
    const tool = toolbarItems.find((item) => item.shortcut === key);
    if (tool) {
      setSelectedTool(tool.id);
    }
  };

  return (
    <div
      className="flex items-center gap-1 bg-[#2D2D2D] p-2 rounded-lg shadow-lg"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {toolbarItems.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedTool === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleToolSelect(item.id)}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              isSelected && "bg-[#5B5BD6] hover:bg-[#5B5BD6]"
            )}
            title={`${item.label} (${item.shortcut})`}
          >
            <Icon
              className={cn(
                "w-4 h-4 transition-colors",
                isSelected ? "text-white" : "text-gray-300"
              )}
            />
            <span
              className={cn(
                "absolute -bottom-1 -right-1 text-[10px] font-medium px-1 py-0.5 rounded bg-gray-700 min-w-[16px] text-center leading-none",
                isSelected ? "text-white bg-[#4A4AB8]" : "text-gray-400"
              )}
            >
              {item.shortcut}
            </span>
          </button>
        );
      })}
    </div>
  );
}
