"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: string;
  size?: string;
}

export const Button = ({ children, className, variant, size }: ButtonProps) => {
  return (
    <button
      className={`${className} ${variant === "primay" ? "primary" : ""} ${size}`}
    >
      {children}
    </button>
  );
};
