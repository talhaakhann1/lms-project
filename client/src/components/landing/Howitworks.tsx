"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, Award, TrendingUp } from "lucide-react";
import type {Variants} from "framer-motion"

const ICON_STROKE = 1.5;

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find your course",
    description:
      "Browse hundreds of courses across development, design, and business. Filter by skill level, topic, or instructor.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Learn at your pace",
    description:
      "Watch lessons, complete exercises, and revisit any module whenever you need. No deadlines, no pressure.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track your progress",
    description:
      "Your dashboard shows exactly where you are in every course. Instructors can see your activity in real time.",
  },
  {
    number: "04",
    icon: Award,
    title: "Earn your certificate",
    description:
      "Finish a course and receive a verified certificate you can share on LinkedIn or attach to any job application.",
  },
];

const containerVariants:Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-muted/40 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex h-8 items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Simple by design
          </motion.span>

          <motion.h2
            variants={itemVariants}
            id="how-it-works-heading"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            From sign-up to certificate in four steps
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-base leading-relaxed text-muted-foreground"
          >
            No complicated setup. Pick a course, start learning, and walk away
            with proof of what you know.
          </motion.p>
        </motion.div>

        {/* ── Steps ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative flex flex-col items-start lg:items-center lg:px-6"
              >
                {/* Connector line between steps (desktop only) */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="absolute top-5 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] lg:block"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, oklch(var(--primary) / 0.4) 0px, oklch(var(--primary) / 0.4) 6px, transparent 6px, transparent 14px)",
                    }}
                  />
                )}

                {/* Number + icon lockup */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                    <Icon
                      className="size-5 text-primary"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="mt-4 lg:text-center">
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}