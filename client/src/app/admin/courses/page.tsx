"use client"
import { useCallback, useEffect, useState } from "react";;
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CourseCardSkeleton } from "@/src/components/cards/CourseCardSkeleton";
import { CourseCard } from "@/src/components/cards/CourseCard";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
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


export default function page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [courses, setCourses] = useState<Course[]>([])
  const store = useAppSelector((state) => state.auth)
  const role=store?.user?.role
  const isLoggedIn=store?.isLoggedIn
  const router = useRouter()
  const fetchAllCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await courseService.getAll()
      
      setCourses(res);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }
  },[])
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
          {role === "admin" && (
            <Button
              onClick={() => router.push("/admin/courses/create")}
              className="gap-2"
            >
              <Plus
                className="h-4 w-4" />
              Create New Course
            </Button>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:gap-8"
        >
          {isLoading ? (
            <CourseCardSkeleton />
          ) : (
            courses.map((course) => (
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
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
