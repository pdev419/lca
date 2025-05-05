"use client";

import { NextPage } from "next";
import React, { useState } from "react";

interface DropdownProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Dropdown: NextPage<DropdownProps> = ({
  options,
  value,
  placeholder,
  onChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between w-full px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-2xl">{value ? value : placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          // xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-gray-600 hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
