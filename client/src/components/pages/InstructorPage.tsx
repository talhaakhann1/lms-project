'use client'

import { motion, type Variants } from "framer-motion";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { FeatureSection } from "../ui/feature-section";
import { FullWidthDivider } from "../ui/full-width-divider";

  const Instructors = [
  {
    id: 1,
    name: "Ahmed Raza",
    designation: "Full-Stack Development Instructor",
  },
  {
    id: 2,
    name: "Sarah Khan",
    designation: "UI/UX Design Instructor",
  },
  {
    id: 3,
    name: "Usman Malik",
    designation: "Data Science Instructor",
  },
  {
    id: 4,
    name: "Ayesha Noor",
    designation: "Digital Marketing Instructor",
  },
  {
    id: 5,
    name: "Hamza Ali",
    designation: "Cybersecurity Instructor",
  },
  {
    id: 6,
    name: "Fatima Zahra",
    designation: "Business & Entrepreneurship Instructor",
  },
];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
 
const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function InstructorsPage() {
  return (
    <section
      aria-labelledby="instructors-heading"
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
            Learn from the best
          </motion.span>

          <motion.h2
            variants={itemVariants}
            id="instructors-heading"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Meet your instructors
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-base leading-relaxed text-muted-foreground"
          >
            Practitioners, not just teachers. Every instructor brings real
            industry experience into the classroom.
          </motion.p>
        </motion.div>

        {/* ── Instructor grid ── */}
       <motion.div
      variants={fadeUpVariants}
      className="mb-10 flex w-full flex-row items-center justify-center"
    >
      <AnimatedTooltip items={Instructors} />
    </motion.div>

      </div>
    </section>
  );
}

export default InstructorsPage;