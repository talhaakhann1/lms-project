"use client"
import { useEffect, useState } from "react";
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { setLoading } from "@/src/store/authSlice";
import { Toast } from "@base-ui/react";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import Image from "next/image";
import { motion } from "framer-motion";
import { CourseCardSkeleton, CourseCardSkeletonGrid } from "@/src/components/cards/CourseCardSkeleton";
import { CourseCard } from "@/src/components/cards/CourseCard";
import { useAppSelector } from "@/src/store/hook";
import { useCallback } from "react";
import { BookOpen } from "lucide-react";
import { CoursesEmptyState } from "@/src/components/landing/about/pages/Coursesemptystate";

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


export default function page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [courses, setCourses] = useState<Course[]>([])
  const user = useAppSelector((state) => state.auth)
  const role = user?.user?.role
  const isLoggedIn = user.isLoggedIn

  const fetchAllCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await courseService.getAll()
      setCourses(res);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchAllCourses()
  }, [fetchAllCourses])

  return (
    <div className="bg-background">

      {/* ── Page header — consistent with section headers across landing page ── */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              {/* Badge — matches hero / section badges */}
              <span className="inline-flex h-8 w-fit items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="relative flex size-1.5" aria-hidden="true">
                  <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                Course catalog
              </span>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Our Courses
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Discover courses designed to help you learn, grow, and turn your
                knowledge into real-world skills.
              </p>
            </div>

            {/* Course count pill */}
            {!isLoading && courses.length > 0 && (
              <span className="inline-flex h-8 shrink-0 items-center rounded-[10px] border border-border bg-background px-3 text-xs font-medium text-muted-foreground shadow-sm">
                {courses.length} courses available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Course grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {isLoading ? (
          <CourseCardSkeletonGrid />
        ) : courses.length === 0 ? (
          <CoursesEmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="h-full"
              >
                <CourseCard
                  isLoggedIn={isLoggedIn}
                  course={course}
                  role={role}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  )
}
