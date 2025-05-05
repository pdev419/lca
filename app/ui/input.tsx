"use client";

import { NextPage } from "next";
import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "onChange" | "children" | "dangerouslySetInnerHTML"
  > {
  value?: string;
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Input: NextPage<InputProps> = ({
  value,
  placeholder,
  error,
  onChange = () => {},
  fullWidth = false,
}) => {
  return (
    <>
      <input
        className={clsx(
          "px-4 py-2 text-2xl border text-gray-600 rounded-md focus:border-blue-sky-300 focus-visible:border-blue-sky-300",
          error ? "border-red-500" : "border-gray-300",
          fullWidth && "w-full"
        )}
        value={value ? value : placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
};

export default Input;
