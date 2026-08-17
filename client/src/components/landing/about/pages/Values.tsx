"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Compass, Heart, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

import { Card } from "../../../ui/card";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const defaultValues: ValueItem[] = [
  {
    icon: Compass,
    title: "Clarity First",
    description:
      "Every screen, course, and lesson is designed to answer one question: what should I do next.",
  },
  {
    icon: Heart,
    title: "Built for Learners",
    description:
      "We design around real study habits, not vanity features. Progress should always feel visible.",
  },
  {
    icon: ShieldCheck,
    title: "Trust by Default",
    description:
      "Instructor tools and student data are handled with the same care we'd want for our own.",
  },
  {
    icon: Zap,
    title: "Move Fast, Stay Solid",
    description:
      "We ship quickly without cutting corners on accessibility, performance, or reliability.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export interface ValuesProps {
  heading?: string;
  description?: string;
  values?: ValueItem[];
}

export function Values({
  heading = "What we care about",
  description = "The principles that guide every product decision we make.",
  values = defaultValues,
}: ValuesProps) {
  return (
    <section
      aria-labelledby="values-heading"
      className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2
          id="values-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {values.map((value) => (
          <motion.div
            key={value.title}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card className="flex h-full flex-col gap-4 rounded-xl border-border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <value.icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Values;