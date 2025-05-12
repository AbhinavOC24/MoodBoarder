import React from "react";
import { ReactNode } from "react";
function IconButton({
  Icon,
  changeShape,
  value,
  currShape,
}: {
  Icon: ReactNode;
  changeShape: any;
  value: string;
  currShape: string;
}) {
  return (
    <div
      className={`pointer rounded-full border ${currShape === value ? "text-teal-300" : "text-white"} p-2 hover:bg-gray`}
      onClick={() => changeShape(value)}
    >
      {Icon}
    </div>
  );
}

export default IconButton;
