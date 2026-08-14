"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  GraduationCap,
  Layers,
  PlayCircle,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { useAppSelector } from "@/src/store/hook";
import heroImage from "@/assets/hero-dashboard.png"
import { orderService } from "@/src/services/order.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { Order } from "@/src/types/interfaces/order.interface";
import { useState, useEffect } from "react";
import { showError } from "@/src/components/ui/toaster";
import { enrollmentService } from "@/src/services/enrollment.service";
import { EnrolledCourse } from "@/src/types/interfaces/enrollment.interface";
import { useRouter } from "next/navigation";
import { log } from "util";
import { DashboardHome } from "@/src/components/admin/dashboard/DashboardHome";
import StudentDashboardSkeleton from "./loading";
import { useCallback } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

// const STUDENT_NAME = "Amara";

// const enrolledCourses: EnrolledCourse[] = [
//   {
//     id: "course-typescript-advanced",
//     title: "Advanced TypeScript Patterns",
//     instructor: "Daniel Osei",
//     thumbnailUrl: "/images/dashboard/course-typescript.jpg",
//     progressPercent: 68,
//     currentLesson: "Conditional Types",
//     href: "/course/course-typescript-advanced",
//   },
//   {
//     id: "course-ux-research",
//     title: "UX Research Fundamentals",
//     instructor: "Priya Nair",
//     thumbnailUrl: "/images/dashboard/course-ux-research.jpg",
//     progressPercent: 42,
//     currentLesson: "Writing Better Survey Questions",
//     href: "/course/course-ux-research",
//   },
//   {
//     id: "course-aws-infra",
//     title: "Cloud Infrastructure with AWS",
//     instructor: "James Whitfield",
//     thumbnailUrl: "/images/dashboard/course-aws.jpg",
//     progressPercent: 15,
//     currentLesson: "Setting Up VPC Networking",
//     href: "/course/course-aws-infra",
//   },
//   {
//     id: "course-design-systems",
//     title: "Design Systems at Scale",
//     instructor: "Priya Nair",
//     thumbnailUrl: "/images/dashboard/course-design-systems.jpg",
//     progressPercent: 91,
//     currentLesson: "Documenting Component Variants",
//     href: "/course/course-design-systems",
//   },
// ];

function EmptyCoursesState() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-20"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
        <Compass className="size-6" strokeWidth={1.5} />
      </span>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          No courses yet
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          You haven't enrolled in any courses. Browse the catalog and start
          your first course to see your progress here.
        </p>
      </div>
      <Button>
        <Link className="flex flex-row gap-2" href="/dashboard/courses">
          Browse Courses
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Link>
      </Button>
    </motion.div>
  );
}



const achievements = [
  {
    icon: CheckCircle2,
    label: "Lessons completed this week",
    value: "9",
  },
  {
    icon: GraduationCap,
    label: "Courses completed",
    value: "3",
  },
  {
    icon: Flame,
    label: "Current learning streak",
    value: "6 days",
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
   const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();
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
    } finally{
      setIsLoading(false)
    }

  },[])
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

  console.log(enrolledCourses);
  if(isLoading){
    return (
      <StudentDashboardSkeleton/>
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