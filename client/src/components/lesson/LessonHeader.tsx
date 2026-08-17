"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, CalendarClock, BarChart, Pencil, Trash2 } from "lucide-react";
import { Lesson } from "@/src/types/interfaces/lesson.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useAppSelector } from "@/src/store/hook";

export type LessonDifficulty = "Beginner" | "Intermediate" | "Advanced";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
export interface LessonHeaderProps {
  lesson: Lesson | null;
  onEdit?: (lessonId: string) => void,
  onDelete?: (lessonId: string) => Promise<void>
}


export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export function LessonHeader({
  lesson,
  onDelete,
  onEdit
}: LessonHeaderProps) {
  const user = useAppSelector((state) => state.auth.user)
  async function handleDelete() {
    await onDelete?.(lesson?.id as string)
  }
  function handleEdit() {
    onEdit?.(lesson?.id as string)
  }
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >

      <div className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          {lesson?.title}
        </h1>
          {user?.role == "admin" && (
        <div className="flex shrink-0 items-center gap-1.5 pt-1">
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit()}
                disabled={!lesson}
                aria-label="Edit lesson"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!lesson}
                    aria-label="Delete lesson"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The lesson and all its content
                      will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Cancel</AlertDialogAction>
                    <AlertDialogAction
                      onClick={() => handleDelete()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
        </div>
          )}
        <p className="max-w-[70ch] text-base leading-7 text-muted-foreground">
          {lesson?.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          {formatDuration(lesson?.video?.duration as number)}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Updated {formatDate(lesson?.updatedAt as string)}
        </span>
      </div>

    </motion.header>
  );
}