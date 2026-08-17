"use client";

import { motion } from "framer-motion";
import { BookOpenCheck, Clock, Star, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export interface CourseStatsData {
  totalLessons: number;
  totalDurationLabel: string;
  totalStudents: number;
  rating: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function CourseStats({ stats }: { stats: CourseStatsData }) {
  const items: StatItem[] = [
    { label: "Lessons", value: stats.totalLessons.toString(), icon: BookOpenCheck },
    { label: "Duration", value: stats.totalDurationLabel, icon: Clock },
    { label: "Students", value: stats.totalStudents.toLocaleString(), icon: Users },
    { label: "Rating", value: stats.rating.toFixed(1), icon: Star },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="grid grid-cols-2 divide-y divide-border p-0 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex flex-col items-center gap-1.5 p-5 text-center"
            >
              <item.icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <span className="font-display text-xl font-bold text-foreground">
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}