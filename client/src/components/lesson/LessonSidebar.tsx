"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Circle, PlayCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Lesson, LessonDetails } from "@/src/types/interfaces/lesson.interface";
import { Button } from "../ui/button";


export interface LessonSidebarProps {
  courseTitle?: string;
  progressPercent?: number | null;
  totalLesson?: number | null;
  completedLesson?: number | null;
  onLessonComplete?: () => Promise<void>
  lessons?: Lesson[];
  lessonCompleted?:boolean;
  courseId?: string | null;
  role?: string | null
}


function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


export function LessonSidebar({ courseTitle, lessons, progressPercent, totalLesson, completedLesson, onLessonComplete, role, courseId,lessonCompleted }: LessonSidebarProps) {
  // const completedCount = lessons.filter((lesson) => lesson.completed).length;

  const handleLessonComplete = async () => {
    await onLessonComplete?.()
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-label="Course progress and lessons"
      className="flex flex-col gap-4"
      >
      {role === "student" && (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="gap-1 p-4 pb-0">
          <CardTitle className="text-base font-semibold text-foreground">
            {courseTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {completedLesson} of {totalLesson} lessons completed
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Course progress</span>
            <span className="font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent ?? 0} aria-label="Course progress" className="h-2" />
          {lessonCompleted?(
            <Button
              onClick={handleLessonComplete}
              disabled
              size="lg"
              className="w-full gap-2 font-semibold"
            >
              <Check className="h-4 w-4" />
              Completed
            </Button>
          ):(
            <Button
              onClick={handleLessonComplete}
              size="lg"
              className="w-full gap-2 font-semibold"
            >
              <Check className="h-4 w-4" />
               Mark as Complete
            </Button>
          )
        }
        </CardContent>
      </Card>
          )
          }

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-1">
            {lessons?.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={role === "admin"
                    ? `/admin/courses/${courseId}/lessons/${lesson.id}`
                    : `/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                  className="flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  <Circle
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />

                  <span className="flex-1 truncate font-semibold text-foreground">
                    {lesson.title}
                  </span>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDuration(lesson.video.duration)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.aside>
  );
}