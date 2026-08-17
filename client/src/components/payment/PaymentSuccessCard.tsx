"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export interface PaymentSuccessCardProps {
  courseName?: string|null;
  courseHref: string;
  dashboardHref: string;
}

export function PaymentSuccessCard({
  courseName,
  courseHref,
  dashboardHref,
}: PaymentSuccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.75} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Payment Successful
            </h1>
            <p className="max-w-[42ch] text-base leading-7 text-muted-foreground">
              Your payment has been successfully processed. You are now enrolled
              in{" "}
              <span className="font-medium text-foreground">{courseName}</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" >
                <Link   className="flex items-center gap-2" href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Go to My Courses
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 font-semibold sm:w-auto"
                
              >
                <Link   className="flex items-center gap-2" href={courseHref}>
                  <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  View Course
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}