"use client"

import Hero from "../../components/landing/Hero";
import Footer from "../../components/layout/Footer";
import { FeaturedCourses } from "../../components/landing/FeaturedCourses";
import TestimonialsPage from "../../components/pages/TestimonialPage";
import FaqsPage from "../../components/pages/FaqsPage";
import InstructorsPage from "../../components/pages/InstructorPage";
import { courseService } from "@/src/services/course.service";
import { useEffect, useState } from "react";
import { Course } from "@/src/types/interfaces/course.interface";
import { useAppSelector } from "@/src/store/hook";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
      const [courses, setCourses] = useState<Course[]>([])
      const user=useAppSelector((state)=>state.auth.user)
      const userRole=user?.role
    
      const fetchAllCourses = async () => {
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
      }
      useEffect(() => {
          fetchAllCourses()
      }, [])
  return (
    <>
      <Hero />
      <FeaturedCourses courses={courses} isLoading={isLoading} role={userRole} />
      <InstructorsPage />
      <TestimonialsPage />
      <FaqsPage />
      <Footer />
    </>
  )
}