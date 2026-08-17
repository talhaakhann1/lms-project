"use client"

import type { Metadata } from "next";
import { CourseCreateForm } from "../../../../../components/course/CourseCreateForm";
import { useCallback, useEffect, useState } from "react";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { authService } from "@/src/services/auth.service";
import { setLoading } from "@/src/store/authSlice";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import CourseFormSkeleton from "@/src/components/course/CourseFormSkeleton";
import { Course } from "@/src/types/interfaces/course.interface";
import { courseService } from "@/src/services/course.service";
import CourseEditForm from "@/src/components/course/CourseEditForm";
import { useParams } from "next/navigation";

export default function EditCoursePage() {
    const [course, setCourse] = useState<Course | null>(null)
    const [instructors, setInstructors] = useState<Instructor[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const params = useParams()
    const courseId = params.courseId as string
    const fetchFormData = useCallback(
        async (courseId: string) => {
        setIsLoading(true)
        try {
            const [course, instructors] = await Promise.all([
                courseService.getById(courseId),
                authService.getInstructors(),
            ])
            setCourse(course)
            setInstructors(instructors)
            showSuccess("Successfully created the course")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<unknown>>;
            const errorMessage =
                axiosError.response?.data.message ?? "Something went wrong";

            showError("Error in editing the course", errorMessage);
        } finally {
            setIsLoading(false)
        }
    },[])
    useEffect(() => {
        fetchFormData(courseId)
    }, [fetchFormData])
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {isLoading ? (
                <CourseFormSkeleton />
            ) : (
                <CourseEditForm
                    course={course}
                    instructors={instructors}
                />
            )}
        </main>
    );
}