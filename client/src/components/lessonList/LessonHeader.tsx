"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type LessonStatus = "available" | "locked";

export type LessonStatusFilter = LessonStatus | "all";

export interface LessonHeaderProps {
  totalCount: number;
  visibleCount?: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: LessonStatusFilter;
  onStatusFilterChange: (value: LessonStatusFilter) => void;
  title?: string;
  description?: string;
}

const filterOptions: { value: LessonStatusFilter; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "locked", label: "Locked" },
];

export function LessonHeader({
  totalCount,
  visibleCount,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  title = "Course Lessons",
  description = "Everything students need to move through this course, in order.",
}: LessonHeaderProps) {
  const showingFiltered =
    typeof visibleCount === "number" && visibleCount !== totalCount;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          {showingFiltered
            ? `${visibleCount} of ${totalCount} lessons`
            : `${totalCount} lesson${totalCount === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search lessons..."
            aria-label="Search lessons"
            className="rounded-lg pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusFilterChange(value as LessonStatusFilter)
          }
        >
          <SelectTrigger
            className="w-full rounded-lg sm:w-[168px]"
            aria-label="Filter lessons by status"
          >
            <SlidersHorizontal
              className="size-4 text-muted-foreground"
              strokeWidth={1.75}
            />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default LessonHeader;