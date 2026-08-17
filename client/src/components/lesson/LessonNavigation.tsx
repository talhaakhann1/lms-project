"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui/card";


 interface LessonNavigationItem {
  id: string;
  title: string;
}


 interface LessonNavigationProps {
  previousLesson?: LessonNavigationItem | null;
  nextLesson?: LessonNavigationItem | null;
  role?:string|null,
  courseId?:string|null
}

export function LessonNavigation({ nextLesson,previousLesson,role,courseId }:LessonNavigationProps ) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {previousLesson ? (
        <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
          <Card className="h-full border-border bg-card p-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <Link
               href={ role === "admin"
    ? `/admin/courses/${courseId}/lessons/${previousLesson.id}`
    : `/dashboard/courses/${courseId}/lessons/${previousLesson.id}`}
              className="flex h-full items-center gap-3 rounded-[inherit] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Previous
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {previousLesson.title}
                </span>
              </div>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <div aria-hidden="true" />
      )}

      {nextLesson ? (
        <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
          <Card className="h-full border-border bg-card p-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <Link
              href={ role === "admin"
    ? `/admin/courses/${courseId}/lessons/${nextLesson.id}`
    : `/dashboard/courses/${courseId}/lessons/${nextLesson.id}`}
              className="flex h-full items-center justify-end gap-3 rounded-[inherit] p-4 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Next Lesson
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {nextLesson.title}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </Card>
        </motion.div>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}