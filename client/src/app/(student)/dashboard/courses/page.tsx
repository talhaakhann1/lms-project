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
    <div className="flex flex-col gap-14 px-4 pb-16 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1.5">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              All Courses
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Explore our collection of courses, build new skills, and learn at
              your own pace with engaging lessons and practical resources.
            </p>
          </div>
        </div>

        {isLoading ? (
          <CourseCardSkeletonGrid />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
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
