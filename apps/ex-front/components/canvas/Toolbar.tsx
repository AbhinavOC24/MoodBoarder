import React from "react";
import IconButton from "./IconButton";
import { Square, Circle, MousePointer2 } from "lucide-react";

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
    </div>
  );
}

export default Toolbar;
