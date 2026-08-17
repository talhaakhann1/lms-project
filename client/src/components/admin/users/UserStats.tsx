"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  UserSquare2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export interface UserStatsData {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface UserStatsProps {
  stats: UserStatsData;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut" as const,
    },
  },
};

export function UserStats({
  stats,
  isLoading = false,
}: UserStatsProps) {
  const items: StatItem[] = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: GraduationCap,
    },
    {
      label: "Instructors",
      value: stats.totalInstructors,
      icon: UserSquare2,
    },
    {
      label: "Admins",
      value: stats.totalAdmins,
      icon: ShieldCheck,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="border-border bg-card shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 pb-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <Skeleton className="h-9 w-20" />
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
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <motion.div key={item.label} variants={itemVariants}>
          <Card className="border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 pb-0">
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>

              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <item.icon
                  className="size-[18px]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                {item.value.toLocaleString()}
              </span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}