"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, SearchX } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useAppSelector } from "@/src/store/hook";

export interface LessonEmptyProps {
  variant?: "no-lessons" | "no-results";
  onCreateLesson?: () => void;
  onClearSearch?: () => void;
}

export function LessonEmpty({
  variant = "no-lessons",
  onCreateLesson,
  onClearSearch,
}: LessonEmptyProps) {
  const user=useAppSelector((state)=>state.auth.user)
  const role=user?.role
  const isNoResults = variant === "no-results";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-20"
    >
      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-secondary">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border border-border"
        />
        {isNoResults ? (
          <SearchX
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
          />
        ) : (
          <BookOpen
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {isNoResults ? "No lessons match your search" : "No lessons yet"}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {isNoResults
            ? "Try a different keyword or clear your filters to see the full lesson list."
            : "This course doesn't have any lessons yet. Add your first lesson to start building the curriculum."}
        </p>
      </div>

      {isNoResults ? (
        <Button variant="outline" onClick={onClearSearch}>
          Clear search
        </Button>
      ) : (
        role=="admin"&&(
        <Button onClick={onCreateLesson}>
          <Plus className="size-4" strokeWidth={1.75} />
          Create First Lesson
        </Button>
        )
      )}
    </motion.div>
  );
}

export default LessonEmpty;