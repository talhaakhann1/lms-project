"use client"

import { useCallback, useEffect, useState } from "react";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { authService } from "@/src/services/auth.service";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { LessonCreateForm } from "@/src/components/admin/lessons/LessonCreateForm";
import { useParams } from "next/navigation";
import LessonFormSkeleton from "@/src/components/admin/lessons/LessonFormSkeleton";
import { AxiosError } from "axios";


export default function CreateLessonPage() {
  const params=useParams()
  const courseId=params.courseId as string
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchFormData = useCallback(async () => {
  setIsLoading(true);

  try {
    const instructors = await authService.getInstructors();
    setInstructors(instructors);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;

    const errorMessage =
      axiosError.response?.data.message ?? "Something went wrong";

    showError("Error in creating lesson", errorMessage);
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchFormData();
}, [fetchFormData]);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {isLoading ? (
        <LessonFormSkeleton />
      ) : (
        <LessonCreateForm
          instructors={instructors}
          courseId={courseId}
        />
      )}
    </main>
  );
}