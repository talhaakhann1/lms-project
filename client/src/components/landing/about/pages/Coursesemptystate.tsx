"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../../../ui/button";
import type {Variants} from "framer-motion"

const ICON_STROKE = 1.5;

const suggestions = [
  { label: "Development",      href: "/courses?category=development" },
  { label: "Design",           href: "/courses?category=design"       },
  { label: "Data Science",     href: "/courses?category=data-science" },
  { label: "Business",         href: "/courses?category=business"     },
  { label: "Cybersecurity",    href: "/courses?category=cybersecurity"},
  { label: "Digital Marketing",href: "/courses?category=marketing"    },
];

const containerVariants:Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants :Variants= {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function CoursesEmptyState() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Icon */}
      <motion.div variants={itemVariants}>
        <div className="relative mx-auto flex size-20 items-center justify-center rounded-2xl border border-border bg-muted shadow-sm">
          <BookOpen
            className="size-9 text-muted-foreground"
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
          {/* Sparkle badge */}
          <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-sm">
            <Sparkles
              className="size-3 text-primary"
              strokeWidth={ICON_STROKE}
              aria-hidden="true"
            />
          </span>
        </div>
      </motion.div>

      {/* Copy */}
      <motion.div
        variants={itemVariants}
        className="mt-6 flex flex-col gap-2"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          No courses found
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t find any courses matching your search. Try a
          different keyword or browse a category below.
        </p>
      </motion.div>

      {/* Category suggestion pills */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
      >
        {suggestions.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="inline-flex h-8 items-center rounded-[10px] border border-border bg-background px-3 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            {s.label}
          </Link>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Button
          render={<Link href="/courses" />}
          className="h-[52px] rounded-[16px] px-6 text-sm font-semibold"
        >
          Browse all courses
          <ArrowRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Button>

        <Button
          variant="outline"
          render={<Link href="/" />}
          className="h-[52px] rounded-[16px] border-border px-6 text-sm font-semibold"
        >
          Back to home
        </Button>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        variants={itemVariants}
        className="mt-8 text-xs text-muted-foreground"
      >
        New courses are added regularly.{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create a free account
        </Link>{" "}
        to get notified.
      </motion.p>
    </motion.div>
  );
}