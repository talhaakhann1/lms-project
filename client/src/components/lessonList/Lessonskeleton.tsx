import * as React from "react";

import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export interface LessonSkeletonProps {
  count?: number;
}

function LessonSkeletonRow() {
  return (
    <Card className="flex flex-col gap-4 rounded-xl border-border p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <Skeleton className="size-11 shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-full max-w-md" />
        <Skeleton className="h-3.5 w-2/3 max-w-sm" />
        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>

      <Skeleton className="size-9 shrink-0 rounded-full" />
    </Card>
  );
}

export function LessonSkeleton({ count = 5 }: LessonSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading lessons"
      className="flex flex-col gap-3 sm:gap-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <LessonSkeletonRow key={index} />
      ))}
      <span className="sr-only">Loading lessons…</span>
    </div>
  );
}

export default LessonSkeleton;