"use client"

import type { Metadata } from "next";
import { CourseCreateForm } from "../../../../components/course/CourseCreateForm";
import { useEffect, useState } from "react";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { authService } from "@/src/services/auth.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import CourseFormSkeleton from "@/src/components/course/CourseFormSkeleton";



export default function CreateCoursePage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const fetchFormData = async () => {
    setIsLoading(true)
    try {
      const [instructors] = await Promise.all([
        authService.getInstructors(),
      ])
      setInstructors(instructors),
  
      showSuccess("Successfully created the course")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError("Error in creating course", errorMessage);
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchFormData()
  }, [])
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {isLoading ? (
        <CourseFormSkeleton />
      ) : (
        <CourseCreateForm
          instructors={instructors}
        />
      )}
    </main>
  );
}