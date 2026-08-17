"use client";

import {
  CheckCircle2,
  Layers,
  PlayCircle,
} from "lucide-react";
import { useAppSelector } from "@/src/store/hook";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { useState, useEffect } from "react";
import { showError } from "@/src/components/ui/toaster";
import { enrollmentService } from "@/src/services/enrollment.service";
import { EnrolledCourse } from "@/src/types/interfaces/enrollment.interface";
import { DashboardHome } from "@/src/components/admin/dashboard/DashboardHome";
import StudentDashboardSkeleton from "./loading";
import { useCallback } from "react";

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [enrolledCourses, setEnrollmentCourses] = useState<EnrolledCourse[]>([])

  const STUDENT_NAME = user?.fullName
  const studentName = STUDENT_NAME
    ? STUDENT_NAME.charAt(0).toUpperCase() + STUDENT_NAME.slice(1)
    : "";

  const getStudentMetrics = useCallback(async () => {
    setIsLoading(true)
    try {
      const enrolledCourses = await enrollmentService.getMyCourses()
      setEnrollmentCourses(enrolledCourses)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "aSomething went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }

  }, [])

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: Layers,
      supportingText: "Total enrollments",
    },
    {
      label: "In Progress",
      value: enrolledCourses.filter(
        (c) => c.progressPercent > 0 && c.progressPercent < 100
      ).length,
      icon: PlayCircle,
      supportingText: "Active courses",
    },
    {
      label: "Completed",
      value: enrolledCourses.filter((c) => c.progressPercent >= 100).length,
      icon: CheckCircle2,
      supportingText: "Finished courses",
    },
  ]

  const currentCourse = enrolledCourses.find(
    (course) =>
      course.progressPercent > 0 &&
      course.progressPercent < 100
  );

  useEffect(() => {
    getStudentMetrics()
  }, [getStudentMetrics])

  if (isLoading) {
    return (
      <StudentDashboardSkeleton />
    )
  }

  return (
    <DashboardHome
      studentName={studentName}
      enrolledCourses={enrolledCourses}
      currentCourse={currentCourse}
      stats={stats}
    />
  );
}