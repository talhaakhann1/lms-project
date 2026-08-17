"use client"

import { CourseHero } from "../../../../../components/courseDetails/CourseHero";
import { CourseDescription } from "../../../../../components/courseDetails/CourseDescription";
import { CourseCurriculum } from "../../../../../components/courseDetails/Coursecurriculum";
import { CourseInstructor } from "../../../../../components/courseDetails/CourseIntructor";
import { CourseReviews } from "../../../../../components/courseDetails/CourseReviews";
import { CourseSidebar } from "../../../../../components/courseDetails/CourseSideBar";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { courseService } from "@/src/services/course.service";
import { Course } from "@/src/types/interfaces/course.interface";
import { reviewService } from "@/src/services/review.service";
import { useParams, useRouter } from "next/navigation";
import { Review } from "@/src/types/interfaces/review.interface";
import CourseDetailLoading from "@/src/components/courseDetails/CourseDetailSkeleton";
import { useAppSelector } from "@/src/store/hook";
import { lessonService } from "@/src/services/lesson.service";
import { Lesson } from "@/src/types/interfaces/lesson.interface";
import { orderService } from "@/src/services/order.service";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const params = useParams();
  const courseId = params.courseId as string
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const userRole=user?.role
 
  const handleBuyNow=async()=>{
    setActionLoading(true)
    try {
      const order=await orderService.create(courseId)
      const orderId=order.id
      router.push(`/checkout/${orderId}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally{
      setActionLoading(false)
    }
  }

  const fetchCourseData = useCallback(async (courseId: string) => {
    setIsLoading(true)
    try {
      const [course, lessons,reviews] = await Promise.all([
        courseService.getById(courseId),
        lessonService.getCourseLessons(courseId),
        reviewService.getCourseReviews(courseId)
      ]);
      setCourse(course);
      setLessons(lessons)
      setReviews(reviews);
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

  useEffect(() => {
    fetchCourseData(courseId)
  }, [courseId])

  if (isLoading) {
    return (
       <div className="flex min-h-screen items-center justify-center">
        <CourseDetailLoading />
      </div>
    )
  }


  return (
 <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-8 lg:py-5">
  <div className="flex min-w-0 flex-col gap-8">
    <CourseHero
      course={course}
    />

    <CourseDescription
      course={course}
    />

    <CourseCurriculum
      lessons={lessons}
      isEnrolled={course?.isEnrolled}
      role={userRole}
      courseId={course?.id}
    />

    <CourseInstructor
      instructor={course?.instructor}
    />

    <CourseReviews
      reviews={reviews}
    />
  </div>

  <CourseSidebar
    course={course}
    role={userRole}
    onBuyNow={handleBuyNow}
    actionLoading={actionLoading}
  />
</div>
  );
}