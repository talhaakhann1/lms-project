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
      console.log("API response:", res);
      // console.log(res);
      setCourses(res);
      // toast
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }
  },[])
  useEffect(() => {
    fetchAllCourses()
  }, [fetchAllCourses])

  return (
    <div className="px-6 pt-24">
      <div className="mx-auto w-full max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>

            <h1 className="text-3xl font-bold text-foreground">
              Our Courses
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Discover courses designed to help you learn, grow, and turn your
              knowledge into real-world skills.
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
