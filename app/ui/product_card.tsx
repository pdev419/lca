"use client";

import { NextPage } from "next";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../lib/supabase";

interface Props {
  id: string;
  title: string;
  result?: string;
  resultUnit?: string;
  editedAt: string;
  onDelete?: () => void;
}

const IconButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className="w-8 h-8 hover:text-white hover:bg-blue-500 border border-current rounded p-1 relative group cursor-pointer"
      onClick={onClick}
    >
      {icon}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};

const ProductCard: NextPage<Props> = ({
  id,
  title,
  result,
  resultUnit,
  editedAt,
  onDelete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setIsDeleting(true);
        const { error } = await supabase.from("project").delete().eq("id", id);

        if (error) {
          throw error;
        }

        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete();
        } else {
          // Refresh the page if no callback is provided
          router.refresh();
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={`w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-row gap-4 rounded-xl font-bold border-gray-300 border-2 hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
        isFocused && "border-blue-400"
      }`}
      onClick={() => setIsFocused(!isFocused)}
      ref={cardRef}
    >
      <div className="flex flex-col w-36 gap-3 sm:gap-4">
        <div className="text-blue-600 text-[18px] sm:text-[20px]">{title}</div>
        <div className="text-gray-400 text-[12px] sm:text-[13px]">
          Edited {formatDate(editedAt)}
        </div>
      </div>
      <div className="h-full flex-1 flex items-center justify-end text-gray-600">
        {isFocused ? (
          <div className="text-[32px] sm:text-[36px] animate-fadeIn transition-all duration-500 ease-in-out">
            <div className="flex items-end gap-2">
              <IconButton
                icon={<EyeIcon className="w-full h-full" />}
                label="View result"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/result/${id}`);
                }}
              />
              <IconButton
                icon={<PencilIcon className="w-full h-full" />}
                label="Edit project"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/create-project?id=${id}`);
                }}
              />
              <IconButton
                icon={<TrashIcon className="w-full h-full" />}
                label="Delete project"
                onClick={handleDelete}
              />
            </div>
          </div>
        ) : (
          <div className="text-[32px] sm:text-[36px]">
            {result
              ? `${Number(result).toFixed(0)} ${resultUnit || "kg"}`
              : "No result"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
