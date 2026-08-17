"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  GraduationCap,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import type { Enrollment } from "@/src/types/interfaces/enrollment.interface";

interface StatCardData {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export interface EnrollmentStatsProps {
  enrollments: Enrollment[];
  isLoading?: boolean;
}

export function EnrollmentStats({
  enrollments,
  isLoading = false,
}: EnrollmentStatsProps) {
  const stats = React.useMemo<StatCardData[]>(() => {
    const totalEnrollments = enrollments.length;

    const totalStudents = new Set(
      enrollments.map((enrollment) => enrollment.user?.id)
    ).size;

    const totalCourses = new Set(
      enrollments.map((enrollment) => enrollment.course?.id)
    ).size;

    return [
      {
        icon: Users,
        title: "Total Enrollments",
        value: totalEnrollments.toLocaleString(),
        description: "Across all courses",
      },
      {
        icon: UserCheck,
        title: "Total Students",
        value: totalStudents.toLocaleString(),
        description: "Enrolled students",
      },
      {
        icon: GraduationCap,
        title: "Total Courses",
        value: totalCourses.toLocaleString(),
        description: "Courses with enrollments",
      },
    ];
  }, [enrollments]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-8 rounded-md" />
            </CardHeader>

            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          variants={cardVariants}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>

              <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                <stat.icon
                  className="size-4.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-1">
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>

              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default EnrollmentStats;