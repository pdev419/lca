"use client";

import clsx from "clsx";

interface ButtonProps {
  fullWidth?: boolean;
  color?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({
  fullWidth = false,
  color = "blue",
  onClick = () => {},
  children,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "flex flex-row justify-center items-center gap-2 px-16 py-4 leading-none rounded-xl text-2xl text-shadow-lg font-bold",
        fullWidth === true && "w-full",
        color === "blue" && "bg-blue-500 text-white hover:bg-blue-400",
        color === "gray" && "bg-gray-100 text-black hover:bg-gray-200",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
