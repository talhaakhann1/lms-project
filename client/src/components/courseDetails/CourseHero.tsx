"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Course } from "@/src/types/interfaces/course.interface";
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
} from "../ui/alert-dialog"
import { Button } from "../ui/button";
import { useAppSelector } from "@/src/store/hook";

export interface CourseHeroProps {
  course?: Course | null
  onEdit?: () => void
  onDelete?: (courseId: string) => Promise<void>
}

export function CourseHero({
  course,
  onDelete,
  onEdit,
}: CourseHeroProps) {
  const user = useAppSelector((state) => state.auth.user)
  async function handleEdit() {
    onEdit?.()
  }
  async function handleDelete() {
    await onDelete?.(course?.id as string)
  }
  return (

<motion.section
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  aria-labelledby="course-title"
  className="flex flex-col gap-5"
>
  <div>
    <Badge
      variant="secondary"
      className="w-fit bg-secondary text-secondary-foreground "
    >
      {course?.category}
    </Badge>
  </div>

  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between gap-4">
      <h1
        id="course-title"
        className="min-w-0 font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
      >
        {course?.title}
      </h1>

      {user?.role === "admin" && (
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit()}
            disabled={!course}
            aria-label="Edit course"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant="ghost"
                size="icon"
                disabled={!course}
                aria-label="Delete course"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. The course and all its lessons
                  will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => handleDelete()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>

    <p className="max-w-[65ch] text-base leading-7 text-muted-foreground">
      {course?.tagline}
    </p>

    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      
      <span>
        By{" "}
        <span className="font-medium text-foreground">
          {course?.instructor?.fullName}
        </span>
      </span>
    </div>
  </div>

  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
    {course?.thumbnail && (
      <Image
        src={course.thumbnail.url}
        alt={`${course?.title} course thumbnail`}
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
      />
    )}
  </div>
</motion.section>


  );
}