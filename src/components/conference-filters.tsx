"use client";

import { type KeyboardEventHandler, useState } from "react";
import { twMerge } from "tailwind-merge";
import TagChips from "@/components/tag-chips";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DUPLICATE_TAG, EMPTY_TAG } from "@/lib/error-messages";
import type { ConferenceFilters } from "@/lib/ui-types";

interface ConferenceFilterPanelProps {
  className?: string;
  // filterState: FilterState;
  onChange?: (filters: ConferenceFilters) => void;
  onApply?: (filters: ConferenceFilters) => void;
}

const MAX_PRICE = 5000;

const defaultFilters: ConferenceFilters = {
  name: "",
  startDate: null,
  endDate: null,
  tags: [],
  priceRange: [0, MAX_PRICE],
};

export default function ConferenceFilterPanel({
  className,
  onChange,
  onApply,
}: ConferenceFilterPanelProps) {
  const [filters, setFilters] = useState<ConferenceFilters>(defaultFilters);
  const [tagInput, setTagInput] = useState("");
  const [tagInputErrorMessage, setTagInputErrorMessage] = useState("");

  function updateFilter<K extends keyof ConferenceFilters>(
    key: K,
    value: ConferenceFilters[K],
  ) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange?.(newFilters);
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    setTagInputErrorMessage("");

    if (event.key === "Enter") {
      if (!tagInput) {
        setTagInputErrorMessage(EMPTY_TAG);
        return;
      }

      if ((filters.tags ?? []).includes(tagInput)) {
        setTagInputErrorMessage(DUPLICATE_TAG);
        return;
      }

      setFilters({
        ...filters,
        tags: [...(filters.tags ?? []), tagInput],
      });
      setTagInput("");
    }
  };

  function handleRemoveTag(tag: string) {
    setFilters({
      ...filters,
      tags: (filters.tags ?? []).filter((t) => t !== tag),
    });
  }

  return (
    <div className={twMerge("space-y-4 p-4 border rounded-lg", className)}>
      <div className="space-y-2">
        <Label className="block" htmlFor="search">
          Conference name
        </Label>
        <Input
          id="search"
          placeholder="Search..."
          value={filters.name}
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="block">Date range</Label>
        <div className="flex items-center gap-2">
          <DatePicker
            label="Start"
            date={filters.startDate}
            onChange={(date) => updateFilter("startDate", date)}
          />
          <DatePicker
            label="End"
            date={filters.endDate}
            onChange={(date) => updateFilter("endDate", date)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <p className="text-sm text-gray-600">
          Get conferences that has one of below tags
        </p>
        <div className="flex flex-wrap gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.currentTarget.value)}
            placeholder="Enter tag name"
            onKeyDown={handleKeyDown}
          />
          <TagChips
            tags={filters.tags ?? []}
            allowRemove
            onRemove={handleRemoveTag}
          />
          {tagInputErrorMessage && (
            <p className="text-red-500 text-sm">{tagInputErrorMessage}</p>
          )}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-1">
        <Label>Price range</Label>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) =>
            updateFilter("priceRange", value as [number, number])
          }
        />
        <div className="text-sm text-muted-foreground">
          ${filters.priceRange?.[0]} - ${filters.priceRange?.[1]}
        </div>
      </div>

      <div className="space-x-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters(defaultFilters);
            onChange?.(defaultFilters);
            setTagInputErrorMessage("");
          }}
        >
          Reset filters
        </Button>
        <Button size="sm" type="button" onClick={() => onApply?.(filters)}>
          Apply
        </Button>
      </div>
    </div>
  );
}
