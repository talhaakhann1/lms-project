"use client";

import { Course } from "@/src/types/interfaces/course.interface";
import { motion } from "framer-motion";
import { CheckCircle2, ListChecks } from "lucide-react";

export interface CourseDescriptionProps {
  course?: Course | null
}

export function CourseDescription({
  course
}: CourseDescriptionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-labelledby="course-description-heading"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3">
        <h2
          id="course-description-heading"
          className="font-display text-2xl font-bold tracking-tight text-foreground"
        >
          About this course
        </h2>
        <p className="max-w-[75ch] text-base leading-7 text-muted-foreground">
          {course?.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ListChecks className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
          What you&apos;ll learn
        </h3>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-sm leading-6 text-muted-foreground">
              {course?.learningOutcomes}
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {course?.requirements}
        </p>
      </div>
    </motion.section>
  );
}