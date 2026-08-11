"use client"
import { LessonHeader } from "../../../../../../components/lesson/LessonHeader";
import { LessonVideoPlayer } from "../../../../../../components/lesson/LessonVideoPlayer";
import { LessonContent } from "../../../../../../components/lesson/LessonContent";
import { LessonResources } from "../../../../../../components/lesson/LessonrResources";
import { LessonSidebar } from "../../../../../../components/lesson/LessonSidebar";
import { useEffect, useState } from "react";
import { lessonService } from "@/src/services/lesson.service";
import { useParams, useRouter } from "next/navigation";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { Lesson, LessonNavigationProps } from "@/src/types/interfaces/lesson.interface";
import ApiResponse from "@/src/utils/ApiResponse";
import { AxiosError } from "axios";
import { Button } from "@base-ui/react";
import { Pencil, Trash2 } from "lucide-react";
import LessonLoading from "@/src/components/lesson/LessonSkeleton";
import { useAppSelector } from "@/src/store/hook";
import { LessonNavigation } from "@/src/components/lesson/LessonNavigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../../components/ui/alert-dialog";



export default function LessonDetailPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
 const [navigation, setNavigation] = useState<LessonNavigationProps|null>(null);
  const user = useAppSelector((state) => state.auth.user)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string
  const courseId = params.courseId as string
  const fetchLessonDetail = async () => {
    setIsLoading(true)
    try {
      const [lesson,
        // lessons
      ] = await Promise.all([
        lessonService.getById(lessonId),
        lessonService.getCourseLessons(courseId)
      ])
      console.log("lesson",lesson);
      
      setLesson(lesson.lesson)
      setNavigation(lesson.navigation)
      setLessons(lessons)
      showSuccess("Successfully get the lesson")
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
    fetchLessonDetail()
  }, [])

  if (isLoading) {
    return (
      <LessonLoading />
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-5">
      <div className="flex flex-col gap-8">
        <LessonHeader lesson={lesson} />
        <LessonVideoPlayer lessonVideo={lesson?.video} lessonCourse={lesson?.course} />
        <LessonContent lessonDescription={lesson?.body} />
        <LessonNavigation
          previousLesson={navigation?.previousLesson}
          nextLesson={navigation?.nextLesson}
        />
      </div>

      <LessonSidebar
        courseTitle={lesson?.course?.title}
      // progressPercent={lesson.progressPercent}
      lessons={lessons}
      />
    </div>
  );
}