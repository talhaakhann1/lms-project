"use client"

import { useCallback, useEffect, useState } from "react";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { authService } from "@/src/services/auth.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { useParams } from "next/navigation";
import LessonFormSkeleton from "@/src/components/admin/lessons/LessonFormSkeleton";
import LessonEditForm from "@/src/components/admin/lessons/LessonEditForm";
import { lessonService } from "@/src/services/lesson.service";
import { Lesson } from "@/src/types/interfaces/lesson.interface";


export default function EditLessonPage() {
  const params=useParams()
  const lessonId=params.lessonId as string
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [lesson, setLesson] = useState<Lesson|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchFormData = useCallback(async () => {
      setIsLoading(true)
      try {
        const [lesson,
          instructors,
        ] = await Promise.all([
          lessonService.getById(lessonId),
          authService.getInstructors(),
          
        ])
        setLesson(lesson.lesson)
        setInstructors(instructors)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        const errorMessage =
          axiosError.response?.data.message ?? "Something went wrong";
  
        console.error(errorMessage);
  
        showError("Error in fetching lesson form data", errorMessage);
      } finally {
        setIsLoading(false)
      }
    },[])

  useEffect(() => {
    fetchFormData()
  }, [fetchFormData])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {isLoading ? (
        <LessonFormSkeleton />
      ) : (
        <LessonEditForm
          instructors={instructors}
          lesson={lesson}
        />
      )}
    </main>
  );
}