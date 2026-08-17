"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { CourseCard } from "../../components/cards/CourseCard";
import { Course } from "@/src/types/interfaces/course.interface";
import Link from "next/link";
import { CourseCardSkeleton, CourseCardSkeletonGrid } from "../cards/CourseCardSkeleton";



const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

interface FeaturedCoursesProps {
  courses?: Course[]
  role?: string | null
  isLoading?: boolean;
}

export function FeaturedCourses({ courses, isLoading, role }: FeaturedCoursesProps) {
  return (
    <section
      id="courses"
      aria-labelledby="featured-courses-heading"
      className="w-full bg-background px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-10 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end"
        >
          <div className="flex max-w-2xl flex-col gap-4">
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 py-4 text-sm font-medium text-secondary-foreground shadow-sm"
            >
              <span className="relative flex size-2 shrink-0" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-primary/40" />
                <span className="relative size-2 rounded-full bg-primary" />
              </span>

              Featured Courses
            </Badge>

            <h2
              id="featured-courses-heading"
              className="font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
            >
              Learn from courses built by experts
            </h2>

            <p className="text-lg leading-8 text-muted-foreground">
              Explore a growing catalog of hands-on courses designed to help
              your team build real, job-ready skills.
            </p>
          </div>

          <Button
            className="shrink-0 font-semibold"
          >
            <Link
              href="/courses"
              className="flex items-center gap-2"
            >
              View All Courses
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <CourseCardSkeletonGrid />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {courses?.slice(0, 3).map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="h-full"
              >
                <CourseCard
                  course={course}
                  role={role}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}