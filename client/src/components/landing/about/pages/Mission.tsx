"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import missonImage from "@/public/images/illustrations/misson-illustration2.png"

export interface MissionProps {
  eyebrow?: string;
  statement?: string;
  supportingText?: string;
}

export function Mission({
  eyebrow = "Our Mission",
  statement =
  "Make learning simple, structured, and genuinely rewarding.",
  supportingText =
  "Edvra brings courses, focused lessons, progress tracking, and learning resources into one seamless experience — helping students stay on track and build skills with confidence.",
}: MissionProps) {
  return (
    <section
      aria-labelledby="mission-heading"
      className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="order-2 flex flex-col gap-5 lg:order-1"
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
        <h2
          id="mission-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {statement}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {supportingText}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
       className="relative aspect-[4/2.8] p-4 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-lg"
      >
        <Image
          src={missonImage}
          alt="Illustration representing focused, structured learning"
          width={960}
          height={720}
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}

export default Mission;