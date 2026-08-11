"use client"
import { useEffect, useState } from "react";
import { AppShell } from "../../../components/app-shell";
// import CoursePage from "@/src/components/course/pages/CoursePage";
import { Dashboard } from "../../../components/dashboard";
import ReviewPage from "../../../components/review/ReviewPage";
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { setLoading } from "@/src/store/authSlice";
import { Toast } from "@base-ui/react";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import Image from "next/image";
import { motion } from "framer-motion";
// import { Star, Users, Clock, BarChart } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
// } from "../../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { Course } from "@/src/types/interfaces/course.interface";
import { useRouter } from "next/navigation";
import { CourseCardSkeleton } from "@/src/components/cards/CourseCardSkeleton";
import { CourseCard } from "@/src/components/cards/CourseCard";
import { Button } from "@/components/ui/button";
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
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()
  const fetchAllCourses = async () => {
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
  }
  useEffect(() => {
    fetchAllCourses()
  }, [])

  return (
    <div className="px-6 pt-24">
  <div className="mx-auto w-full max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
          
            <h1 className="text-3xl font-bold text-foreground">
              Our Courses
            </h1>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
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
                  course={course}
                  role={user?.role}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
