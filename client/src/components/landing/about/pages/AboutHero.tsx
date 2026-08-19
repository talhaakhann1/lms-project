"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import heroImage from "@/public/images/illustrations/about-illustration.webp"

export interface AboutHeroProps {
  badgeLabel?: string;
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function AboutHero({
  badgeLabel = "About Us",
  heading = "Learning, built for how people actually grow.",
  description = "We're a small team building tools that help students, instructors, and institutions teach and learn without friction.",
  ctaLabel = "Explore Courses",
  ctaHref = "/courses",
}: AboutHeroProps) {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-start gap-6"
      >
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
        >
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {badgeLabel}
        </Badge>

        <h1
          id="about-hero-heading"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {heading}
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>

        <Button size="lg" className="mt-2">
          <Link className="flex items-center gap-2" href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="relative aspect-[4/2.8]  w-full overflow-hidden p-4 rounded-2xl border border-border bg-muted shadow-lg"
      >
        <Image
          src={heroImage}
          alt="Illustration of students and instructors collaborating on the platform"
          width={960}
          height={720}
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
          priority
        />
      </motion.div>
    </section>
  );
}

export default AboutHero;
