"use client"

import { LessonHeader } from "../../../../../../../components/lesson/LessonHeader";
import { LessonVideoPlayer } from "../../../../../../../components/lesson/LessonVideoPlayer";
import { LessonContent } from "../../../../../../../components/lesson/LessonContent";
import { LessonNavigation } from "../../../../../../../components/lesson/LessonNavigation";
import { LessonSidebar } from "../../../../../../../components/lesson/LessonSidebar";
import { useCallback, useEffect, useState } from "react";
import { lessonService } from "@/src/services/lesson.service";
import { useParams, useRouter } from "next/navigation";
import { showError, showInfo, showSuccess } from "@/src/components/ui/toaster";
import { Lesson, LessonNavigationProps } from "@/src/types/interfaces/lesson.interface";
import ApiResponse from "@/src/utils/ApiResponse";
import { AxiosError } from "axios";;
import LessonLoading from "@/src/components/lesson/LessonSkeleton";
import { useAppSelector } from "@/src/store/hook";
import { LessonProgress } from "@/src/types/interfaces/lessonProgress.interface";
import { progressService } from "@/src/services/progress.service";

export default function LessonDetailPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<LessonProgress | null>(null)
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
        lessons,
        progress
      ] = await Promise.all([
        lessonService.getById(lessonId),
        lessonService.getCourseLessons(courseId),
        progressService.getLessonProgress(lessonId)
      ])
      setLesson(lesson.lesson)
      setNavigation(lesson.navigation)
      setLessons(lessons)
      setProgress(progress)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError("Error in fetching lesson detail", errorMessage);
    } finally {
      setIsLoading(false)
    }
  }, [])
  const completeLesson = async () => {
    if (!lesson) return;
    if (!isVideoEnded(watchedSeconds, duration)) {
      showInfo("Please watch the entire video first.");
      return;
    }
    try {
      await progressService.completeLesson(lesson.id);

      showSuccess("Lesson marked completed");
      console.log(navigation);
      
      if (navigation?.nextLesson?.id) {
        router.push(
          `/dashboard/courses/${courseId}/lessons/${navigation.nextLesson.id}`
        );
        showInfo("Redirecting to new lesson")
      }else{
        router.push(
          `/dashboard`
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      showError(
        "Failed to update lesson status",
        axiosError.response?.data.message ?? "Something went wrong"
      );
    }
  }

  useEffect(() => {
    fetchLessonDetail()
  }, [lessonId, courseId])

  if (isLoading) {
    return (
      <LessonLoading />
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-5">
      <div className="flex flex-col gap-8">
        <LessonHeader lesson={lesson} />
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
        totalLesson={progress?.totalLessons}
        completedLesson={progress?.completedLessons}
        progressPercent={progress?.progress}
        lessonCompleted={lesson?.isCompleted}
        courseTitle={lesson?.course?.title}
        lessons={lessons}
      />
    </div>
  );
}