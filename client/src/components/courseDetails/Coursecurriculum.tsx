
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, PlayCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { cn } from "@/src/lib/utils";
import type { Lesson } from "@/src/types/interfaces/lesson.interface";
import { UserRoles } from "@/src/types/enums/user.enum";

export interface CourseCurriculumProps {
  lessons?: Lesson[];
  isEnrolled?: boolean | null;
  role?: UserRoles;
  courseId?: string | null;
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}

function getTotalDuration(lessons: Lesson[]): string {
  const totalSeconds = lessons.reduce(
    (sum, lesson) => sum + (lesson.video?.duration ?? 0),
    0
  );

  return formatDuration(totalSeconds);
}

export function CourseCurriculum({
  lessons = [],
  isEnrolled,
  role,
  courseId,
}: CourseCurriculumProps) {
  const router = useRouter();

  const handleOnClick = (lessonId: string) => {

    router.push(
      role === "admin"
        ? `/admin/courses/${courseId}/lessons/${lessonId}`
        : `/dashboard/courses/${courseId}/lessons/${lessonId}`
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-labelledby="course-curriculum-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="course-curriculum-heading"
          className="font-display text-2xl font-bold tracking-tight text-foreground"
        >
          Course Curriculum
        </h2>

        <span className="text-sm text-muted-foreground">
          {lessons.length} lessons · {getTotalDuration(lessons)}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();

            router.push(
              role === "admin"
                ? `/admin/courses/${courseId}/lessons`
                : `/dashboard/courses/${courseId}/lessons`
            );
          }}
        >
          View Details
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No lessons available yet.
          </p>
        </div>
      ) : (
        <Accordion
          defaultValue={lessons[0]?.id ? [lessons[0].id] : []}
          className="w-full"
        >
          {lessons.map((lesson) => {
            const isLessonAccessible =
              isEnrolled || ["admin", "instructor"].includes(role ?? "");
            console.log("acess", isLessonAccessible);


            return (
              <AccordionItem
                key={lesson.id}
                value={lesson.id}
                className="mb-3 rounded-lg border border-border bg-card px-2 last:mb-0"
              >
                <AccordionTrigger className="gap-3 px-2 py-4 text-left hover:no-underline">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {isLessonAccessible ? (
                      <PlayCircle
                        className="size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    ) : (
                      <Lock
                        className="size-4 shrink-0 text-primary"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={cn(
                        "truncate text-sm font-semibold",
                        isLessonAccessible
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {lesson.title}
                    </span>

                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {formatDuration(lesson.video?.duration ?? 0)}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-2 pb-3">
                  <div
                    onClick={() =>{
                       if (isLessonAccessible) {
                      handleOnClick(lesson.id);
                    }
                    }}
                    role={isLessonAccessible ? "button" : undefined}
                    tabIndex={isLessonAccessible ? 0 : undefined}
                    onKeyDown={(event) => {
                      if (
                        isLessonAccessible &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        handleOnClick(lesson.id);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-md border border-border/60 px-3 py-3 transition-colors",
                      isLessonAccessible
                        ? "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        : "cursor-not-allowed opacity-70"
                    )}
                  >
                    {isLessonAccessible ? (
                      <PlayCircle
                        className="size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    ) : (
                      <Lock
                        className="size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isLessonAccessible
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {lesson.title}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {isLessonAccessible
                          ? "Click to open this lesson"
                          : "Purchase this course to access this lesson"}
                      </p>
                    </div>

                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </motion.section>
  );
}

export default CourseCurriculum;

