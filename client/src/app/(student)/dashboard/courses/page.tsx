"use client"

import { useCallback, useEffect, useState } from "react";
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";;
import { motion } from "framer-motion";
import {  CourseCardSkeletonGrid } from "@/src/components/cards/CourseCardSkeleton";
import { CourseCard } from "@/src/components/cards/CourseCard";
import { useAppSelector } from "@/src/store/hook";
import CourseEditForm from "@/src/components/course/CourseEditForm";
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


export default function ExploreCoursePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [courses, setCourses] = useState<Course[]>([])
  const user = useAppSelector((state) => state.auth.user)
  const store = useAppSelector((state) => state.auth)
  const role = store?.user?.role
  const isLoggedIn = store?.isLoggedIn
  const fetchAllCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await courseService.getAll()
    
      setCourses(res);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError("Error in fetching courses", errorMessage);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllCourses()
  }, [fetchAllCourses])

  return (
    <div className="min-h-screen ">

  {/* ── Page header band ── */}
  <div className="border-b border-border bg-background">
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          All Courses
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Explore our collection of courses, build new skills, and learn at
          your own pace with engaging lessons and practical resources.
        </p>
      </div>
    </div>
  </div>

  {/* ── Course grid ── */}
  <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
    {isLoading ? (
      <CourseCardSkeletonGrid />
    ) : courses.length === 0 ?(
      <CoursesEmptyState/>
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
