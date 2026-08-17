"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { value: 500, suffix: "+", label: "Students" },
  { value: 12, suffix: "+", label: "Courses" },
  { value: 8, suffix: "+", label: "Instructors" },
  { value: 12, suffix: "+", label: "Countries" },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function AnimatedNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 90,
  });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref}>{new Intl.NumberFormat("en-US").format(display)}</span>
  );
}

export interface StatsProps {
  heading?: string;
  stats?: StatItem[];
}

export function Stats({
  heading = "Trusted by learners everywhere",
  stats = defaultStats,
}: StatsProps) {
  return (
    <section
      aria-labelledby="stats-heading"
      className="border-y border-border bg-muted/30"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8">
        <h2
          id="stats-heading"
          className="mb-12 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>

        <motion.dl
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <dt className="order-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

export default Stats;