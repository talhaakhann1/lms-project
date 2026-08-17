"use client"

import { EnrollmentStats } from "../../../components/admin/enrollments/EnrollmentStats";
import { EnrollmentsTable } from "../../../components/admin/enrollments/EnrollmentsTable";
import { useCallback, useEffect, useState } from "react";
import { enrollmentService } from "@/src/services/enrollment.service";
import { showError } from "@/src/components/ui/toaster";
import ApiResponse from "@/src/utils/ApiResponse";
import { AxiosError } from "axios";
import { Enrollment } from "@/src/types/interfaces/enrollment.interface";


export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment []>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchEnrollments = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await enrollmentService.getAll();
      setEnrollments(res);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "aSomething went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)  
    }
  },[])
  
  useEffect(()=>{
    fetchEnrollments()
  },[fetchEnrollments])
  return (
   <main className="w-full max-w-5xl min-w-0 space-y-8 overflow-x-hidden px-2 pb-16 sm:px-3 lg:px-4">
  <div className="min-w-0 space-y-1.5">
    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      Enrollments
    </h1>

    <p className="text-sm text-muted-foreground sm:text-base">
      Manage student enrollments across all courses.
    </p>
  </div>

  <div className="min-w-0 w-full">
    <EnrollmentStats
      enrollments={enrollments}
      isLoading={isLoading}
    />
  </div>

  <div className="min-w-0 w-full overflow-x-auto">
    <EnrollmentsTable
      isLoading={isLoading}
      enrollments={enrollments}
    />
  </div>
</main>
  );
}