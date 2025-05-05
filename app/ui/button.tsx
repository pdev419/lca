"use client";

import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/solid";

interface ButtonProps {
  fullWidth?: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({
  fullWidth = false,
  color = "blue",
  onClick = () => {},
  children,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "flex flex-row justify-center items-center gap-2 px-16 py-4 leading-none rounded-xl text-2xl text-shadow-lg font-bold",
        fullWidth === true && "w-full",
        color === "blue" && "bg-blue-500 text-white hover:bg-blue-400",
        color === "gray" && "bg-gray-100 text-black hover:bg-gray-200"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
