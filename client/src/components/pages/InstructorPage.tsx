'use client'

import { motion, type Variants } from "framer-motion";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { FeatureSection } from "../ui/feature-section";
import { FullWidthDivider } from "../ui/full-width-divider";

function InstructorsPage() {
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


const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};
 
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
 
const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
 
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center overflow-hidden border-x bg-background">
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="flex w-full flex-col items-center justify-center px-6 py-20"
  >
    <motion.h2
      variants={fadeUpVariants}
      className="mb-8 text-center text-2xl font-bold text-foreground md:text-4xl lg:text-7xl"
    >
      Meet Our Instructors
    </motion.h2>

    <motion.p
      variants={fadeUpVariants}
      className="mb-4 text-center text-base text-muted-foreground md:text-lg"
    >
       Meet the experienced instructor who will guide you through your learning journey
    </motion.p>

    <motion.div
      variants={fadeUpVariants}
      className="mb-10 flex w-full flex-row items-center justify-center"
    >
      <AnimatedTooltip items={Instructors} />
    </motion.div>

    <motion.section
      variants={sectionRevealVariants}
      className="w-full px-4"
    >
      <FullWidthDivider />

      <FeatureSection />

      <FullWidthDivider />
    </motion.section>
  </motion.div>
</div>
  );
}


export default InstructorsPage