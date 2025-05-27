import React from "react";
import IconButton from "./IconButton";
import {
  Square,
  Circle,
  MousePointer2,
  Pencil,
  Eraser,
  ArrowUpRight,
  Type,
} from "lucide-react";

interface ToolbarProps {
  changeShape: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currShape: string;
}

function Toolbar({ changeShape, currShape }: ToolbarProps) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-3 p-2">
      <IconButton
        Icon={<Square />}
        changeShape={changeShape}
        currShape={currShape}
        value="rect"
      />
      <IconButton
        Icon={<Circle />}
        changeShape={changeShape}
        currShape={currShape}
        value="circle"
      />
      <IconButton
        Icon={<MousePointer2 />}
        changeShape={changeShape}
        currShape={currShape}
        value="pointer"
      />
      <IconButton
        Icon={<Pencil />}
        changeShape={changeShape}
        currShape={currShape}
        value="pencil"
      />
      <IconButton
        Icon={<Eraser />}
        changeShape={changeShape}
        currShape={currShape}
        value="eraser"
      />
      <IconButton
        Icon={<ArrowUpRight />}
        changeShape={changeShape}
        currShape={currShape}
        value="arrow"
      />
      <IconButton
        Icon={<Type />}
        changeShape={changeShape}
        currShape={currShape}
        value="text"
      />
    </div>
  );
}

export default Toolbar;
