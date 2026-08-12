"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
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

// ─── Mock data ────────────────────────────────────────────────────────────────

// const STUDENT_NAME = "Amara";

// interface EnrolledCourse {
//   id: string;
//   title: string;
//   instructor: string;
//   thumbnailUrl: string;
//   progressPercent: number;
//   currentLesson: string;
//   href: string;
// }

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
  const router = useRouter();
  const [enrolledCourses, setEnrollmentCourses] = useState<EnrolledCourse[]>([])

  const STUDENT_NAME = user?.fullName
  const studentName = STUDENT_NAME
    ? STUDENT_NAME.charAt(0).toUpperCase() + STUDENT_NAME.slice(1)
    : "";
  const getStudentMetrics = async () => {
    try {
      const enrolledCourses = await enrollmentService.getMyCourses()
      setEnrollmentCourses(enrolledCourses)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "aSomething went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    }

  }
  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: Layers,
    },
    {
      label: "In Progress",
      value: enrolledCourses.filter(
        (c) => c.progressPercent > 0 && c.progressPercent < 100
      ).length,
      icon: PlayCircle,
    },
    {
      label: "Completed",
      value: enrolledCourses.filter((c) => c.progressPercent >= 100).length,
      icon: CheckCircle2,
    },
  ];
  const currentCourse = enrolledCourses.find(
    (course) =>
      course.progressPercent > 0 &&
      course.progressPercent < 100
  );
  useEffect(() => {
    getStudentMetrics()
  }, [])

  console.log(enrolledCourses);
  



  return (
    <div className="flex flex-col gap-14 pb-16 overflow-x-hidden">
      {/* Welcome header */}
     <motion.section
  initial="hidden"
  animate="show"
  variants={fadeUp}
  aria-labelledby="hero-heading"
  className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
>
  {/* Left content */}
  <div className="flex flex-col">
    {/* Welcome */}
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Welcome back, {studentName}
      </h1>

      <p className="text-sm text-muted-foreground sm:text-base">
        A little progress each day adds up to big results.
      </p>
    </div>

    {/* Hero text */}
    <div className="mt-20 flex flex-col items-start gap-4">
      <span className="text-sm font-medium text-primary">
        Continue your journey
      </span>

      <h2
        id="hero-heading"
        className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl"
      >
        Pick up right where you left off.
      </h2>

      <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        You're making steady progress. Jump back into your current
        lesson, or explore something new to add to your learning path.
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          {currentCourse?.currentLesson?.id ? (
            <Link
              href={`/dashboard/courses/${currentCourse.id}/lessons/${currentCourse.currentLesson.id}`}
              className="flex items-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>All Caught Up</span>
            </span>
          )}
        </Button>

        <Button variant="outline" asChild>
          <Link href="/dashboard/courses">
            Browse More Courses
          </Link>
        </Button>
      </div>
    </div>
  </div>

  {/* Image */}
  <div className="relative min-h-[480px] w-full overflow-visible rounded-xl bg-background lg:min-h-full">
    <Image
      src={heroImage}
      alt="Illustration of a student studying with a laptop and open book"
      fill
      sizes="(min-width: 1024px) 480px, 100vw"
      className="object-contain translate-y-16 scale-165"
      priority
    />
  </div>
</motion.section>

      {/* Learning overview */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
        aria-label="Learning overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card className="rounded-xl border-border p-5 shadow-sm">
              <CardContent className="flex items-center gap-4 p-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <stat.icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* My Courses */}
      <section aria-labelledby="my-courses-heading" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2
            id="my-courses-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            My Courses
          </h2>
          <Link
            href="/dashboard/my-courses"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {enrolledCourses.map((course) => (
            <motion.div key={course.id} variants={fadeUp}>
              <Card onClick={() => router.push(`/courses/${course.id}`)} className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border-border p-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={course.thumbnailUrl}
                    alt={`${course.title} thumbnail`}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                </div>

                <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold leading-snug text-foreground">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor.name}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <Progress value={course.progressPercent} className="h-1.5" />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Currently on: {course.currentLesson?.title}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="mt-auto w-full justify-between"
                  >
                    {
                      course.currentLesson?.id ? (
                        <Link
                          href={`/dashboard/courses/${course.id}/lessons/${course.currentLesson.id}`}
                          className="flex items-center gap-2"
                        >
                          <span>Continue Learning</span>
                          <ArrowRight className="size-4" strokeWidth={1.75} />
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <span>Completed</span>
                        </span>
                      )
                    }
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recent Achievements */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        aria-labelledby="achievements-heading"
      >
        <Card className="rounded-xl border-border p-6 shadow-sm">
          <h2
            id="achievements-heading"
            className="mb-5 text-lg font-semibold text-foreground"
          >
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {achievements.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <item.icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="space-y-0.5">
                  <p className="text-base font-semibold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>

      {/* Motivation banner */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
        aria-label="Motivation"
        className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 px-6 py-12 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="size-5" strokeWidth={1.75} />
        </span>
        <p className="max-w-md text-base font-medium text-foreground">
          Consistency beats intensity. A focused 20 minutes today keeps you
          closer to your goal than a rushed hour next week.
        </p>
      </motion.section>
    </div>
  );
}