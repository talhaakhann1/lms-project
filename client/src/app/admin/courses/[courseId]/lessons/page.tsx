"use client";

import { useParams } from "next/navigation";
import { useAppSelector } from "@/src/store/hook";
import LessonList from "@/src/components/lessonList/Lessonlist";
import { lessonService } from "@/src/services/lesson.service";
import { courseService } from "@/src/services/course.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { Lesson } from "@/src/types/interfaces/lesson.interface";
import { Course } from "@/src/types/interfaces/course.interface";
import { useState,useEffect } from "react";
import { showError } from "@/src/components/ui/toaster";
import { useCallback } from "react";




export function LessonListPage(){
      const [lessons, setLessons] =useState<Lesson[]>([])
      const [course, setCourse] =useState<Course|null>(null)
      const user = useAppSelector((state) => state.auth.user)
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const params = useParams()
      const courseId=params.courseId as string

   const fetchLessonDetail = useCallback(async () => {
       setIsLoading(true)
       try {
         const [lessons,course]= await Promise.all([
             lessonService.getCourseLessons(courseId),
             courseService.getById(courseId),
         ])
    
         setLessons(lessons)
         setCourse(course)
        
       } catch (error) {
         const axiosError = error as AxiosError<ApiResponse<unknown>>;
         const errorMessage =
           axiosError.response?.data.message ?? "Something went wrong";
   
         showError("Error in fetching lesson detail", errorMessage);
       } finally {
         setIsLoading(false)
       }
     },[])
     useEffect(() => {
     
         fetchLessonDetail()
       }, [])
     
    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-5">
            <LessonList
                isLoading={isLoading} lessons={lessons} courseId={course?.id}
                isEnrolled={course?.isEnrolled}
                role={user?.role}
            />

        </div>
    );
}

export default LessonListPage;
