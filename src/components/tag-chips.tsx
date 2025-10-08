"use client";

import { X } from "lucide-react";
import { Fragment, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TagChipsProps extends HTMLAttributes<HTMLUListElement> {
  tags: string[];
  allowRemove?: boolean;
  onRemove?: (tag: string) => void;
}

export default function TagChips({
  allowRemove = false,
  tags,
  onRemove,
  className,
}: TagChipsProps) {
  const ChipComponentWrapper = allowRemove ? "li" : Fragment;
  const ChipComponent = allowRemove ? "button" : "li";

  return (
    <ul className={twMerge("flex flex-row flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <ChipComponentWrapper key={tag}>
          <ChipComponent
            {...(allowRemove
              ? { type: "button", onClick: () => onRemove?.(tag) }
              : {})}
            className={twMerge(
              "px-4 py-1.5 bg-gray-200 rounded-full text-sm ",
              allowRemove &&
                "space-x-1 flex items-center pr-2 hover:bg-gray-200/60 cursor-pointer",
            )}
          >
            <span>{tag}</span>
            {allowRemove && <X className="inline size-3" />}
          </ChipComponent>{" "}
        </ChipComponentWrapper>
      ))}
    </ul>
  );
}
