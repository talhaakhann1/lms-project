"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "../../../ui/button";

export interface CTAProps {
  heading?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTA({
  heading = "Ready to start learning?",
  description = "Join thousands of students and instructors already building skills on the platform.",
  primaryLabel = "Get Started",
  primaryHref = "/sign-up",
  secondaryLabel = "Contact Us",
  secondaryHref = "/contact",
}: CTAProps) {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="mx-auto w-full max-w-4xl px-6 py-20 text-center sm:py-28 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <h2
          id="about-cta-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" >
            <Link className="flex items-center gap-2" href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
          <Button size="lg" variant="outline" >
            <Link className="flex items-center gap-2" href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export default CTA;