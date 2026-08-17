"use client"
import { LessonHeader } from "../../../../../../components/lesson/LessonHeader";
import { LessonVideoPlayer } from "../../../../../../components/lesson/LessonVideoPlayer";
import { LessonContent } from "../../../../../../components/lesson/LessonContent";
import { LessonResources } from "../../../../../../components/lesson/LessonrResources";
import { LessonNavigation } from "../../../../../../components/lesson/LessonNavigation";
import { LessonSidebar } from "../../../../../../components/lesson/LessonSidebar";
import { useCallback, useEffect, useState } from "react";
import { lessonService } from "@/src/services/lesson.service";
import { useParams, useRouter } from "next/navigation";
import { showError, showInfo, showSuccess } from "@/src/components/ui/toaster";
import { Lesson, LessonNavigationProps } from "@/src/types/interfaces/lesson.interface";
import ApiResponse from "@/src/utils/ApiResponse";
import { AxiosError } from "axios";;
import { Pencil, Trash2 } from "lucide-react";
import LessonLoading from "@/src/components/lesson/LessonSkeleton";
import { useAppSelector } from "@/src/store/hook";
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
import { progressService } from "@/src/services/progress.service";
import { LessonProgress } from "@/src/types/interfaces/lessonProgress.interface";



export default function LessonDetailPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
 
  const [lessons, setLessons] = useState<Lesson[]>([])

  const user = useAppSelector((state) => state.auth.user)
  const [navigation, setNavigation] = useState<LessonNavigationProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const params = useParams()
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const router = useRouter()
  const lessonId = params.lessonId as string
  const courseId = params.courseId as string
  const isVideoEnded = (
    watchedSeconds: number,
    duration: number
  ) => {
    if (!duration || duration <= 0) {
      return false;
    }

    return watchedSeconds >= duration - 1;
  };
  const fetchLessonDetail = useCallback(async () => {
    setIsLoading(true)
    try {
      const [lesson,
        lessons
      ] = await Promise.all([
        lessonService.getById(lessonId),
        lessonService.getCourseLessons(courseId),
      ])
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
  },[])

  const completeLesson = async () => {
    if (!lesson) return;
    if (!isVideoEnded(watchedSeconds, duration)) {
      showInfo("Please watch the entire video first.");
      return;
    }
    try {
      await progressService.completeLesson(lesson.id);

      showSuccess("Lesson marked completed");
      router.push(`/admin/courses/${courseId}/lessons/${navigation?.nextLesson?.id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      showError(
        "Delete failed",
        axiosError.response?.data.message ?? "Something went wrong"
      );
    }
  }

  const handleEdit = () => {
    if (!lesson) return;
    router.push(`/admin/courses/${courseId}/lessons/${lesson.id}/edit`);
  };

  const handleDelete = async () => {
    if (!lesson) return;

    try {
      await lessonService.delete(lesson.id);

      showSuccess("Lesson deleted successfully");
      router.push(`/admin/courses/${courseId}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      showError(
        "Delete failed",
        axiosError.response?.data.message ?? "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchLessonDetail()
  }, [lessonId])

  if (isLoading) {
    return (
      <LessonLoading />
    )
  }

  return (
  <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-5">
        <div className="flex flex-col gap-8">
        <LessonHeader lesson={lesson} onEdit={handleEdit} onDelete={handleDelete} />
        <LessonVideoPlayer
          onProgressChange={(watched, duration) => {
            setWatchedSeconds(watched);
            setDuration(duration);
          }}
          lessonVideo={lesson?.video}
          lessonCourse={lesson?.course} />
        <LessonContent lessonDescription={lesson?.body} />
       
        <LessonNavigation
          previousLesson={navigation?.previousLesson}
          nextLesson={navigation?.nextLesson}
          role={user?.role}
          courseId={courseId}
        />
      </div>

      <LessonSidebar
        role={user?.role}
        courseId={courseId}
        onLessonComplete={completeLesson}
        lessonCompleted={lesson?.isCompleted}
        courseTitle={lesson?.course?.title}
        lessons={lessons}
      />
    </div>
  );
}