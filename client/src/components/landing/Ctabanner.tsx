"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button"
import type {Variants} from "framer-motion"

const ICON_STROKE = 1.5;

const stats = [
  { value: "500+", label: "Active learners" },
  { value: "4.8",  label: "Average rating"  },
  { value: "120+", label: "Courses live"    },
];

const containerVariants:Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-background py-16 lg:py-24"
    >
      {/* Subtle primary tint block — right-side accent matching hero panel language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-primary/5 lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
          <div className="px-8 py-12 lg:px-14 lg:py-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid items-center gap-10 lg:grid-cols-[1fr_auto]"
            >
              {/* ── Left: copy ── */}
              <div className="flex flex-col gap-6">
                <motion.span
                  variants={itemVariants}
                  className="inline-flex h-8 w-fit items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  <span className="relative flex size-1.5" aria-hidden="true">
                    <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                  </span>
                  Start for free today
                </motion.span>

                <div className="flex flex-col gap-3">
                  <motion.h2
                    variants={itemVariants}
                    id="cta-heading"
                    className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[44px] lg:leading-[1.1]"
                  >
                    Ready to start learning?
                  </motion.h2>

                  <motion.p
                    variants={itemVariants}
                    className="max-w-lg text-base leading-relaxed text-muted-foreground"
                  >
                    Join thousands of learners already growing their skills.
                    Create a free account and get instant access to your first
                    course.
                  </motion.p>
                </div>

                {/* Stats row */}
                <motion.ul
                  variants={itemVariants}
                  className="flex flex-wrap items-center gap-x-8 gap-y-3"
                >
                  {stats.map((stat, i) => (
                    <li key={stat.label} className="flex items-center gap-3">
                      {i !== 0 && (
                        <span
                          aria-hidden="true"
                          className="hidden h-4 w-px bg-border sm:block"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">
                          {stat.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stat.label}
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>

                {/* CTA buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-4"
                >
                  <Button
                    render={<Link href="/sign-up" />}
                    className="h-[52px] w-full rounded-[16px] px-6 text-sm font-semibold sm:w-auto"
                  >
                    Create free account
                    <ArrowRight
                      className="size-4"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                  </Button>

                  <Button
                    variant="outline"
                    render={<Link href="/courses" />}
                    className="h-[52px] w-full rounded-[16px] border-border px-6 text-sm font-semibold sm:w-auto"
                  >
                    Browse courses
                  </Button>
                </motion.div>
              </div>

              {/* ── Right: visual accent card (desktop only) ── */}
              <motion.div
                variants={itemVariants}
                className="hidden lg:block"
              >
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6 shadow-sm w-64">
                  {/* Mini progress preview */}
                  <p className="text-xs font-medium text-muted-foreground">
                    Your progress
                  </p>
                  {[
                    { label: "React Fundamentals",  pct: 72 },
                    { label: "UI Design Basics",    pct: 45 },
                    { label: "Node.js for Beginners", pct: 18 },
                  ].map((course) => (
                    <div key={course.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground truncate max-w-[160px]">
                          {course.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${course.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      3 courses in progress
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Keep going →
                    </span>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}