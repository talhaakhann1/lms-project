"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { TestimonialCard, type Testimonial } from "../../components/cards/TestimonailCard";

const testimonials: Testimonial[] = [
  {
    name: "Maya Chen",
    role: "Program Director",
    company: "Northfield Academy",
    avatarInitials: "MC",
    logoLabel: "Northfield",
    quote:
      "Rolling out courses used to take weeks. Now our instructors publish a full module in an afternoon, and completion rates have never been higher.",
    tags: ["Education", "Mid-Size"],
  },
  {
    name: "Daniel Osei",
    role: "Head of Learning",
    company: "Brightline Labs",
    avatarInitials: "DO",
    logoLabel: "Brightline",
    quote:
      "The analytics dashboard finally gives us a clear picture of where students get stuck. We've cut support tickets by a third since switching.",
    tags: ["Technology", "Enterprise"],
  },
  {
    name: "Priya Nair",
    role: "Operations Lead",
    company: "Summit Learning Co.",
    avatarInitials: "PN",
    logoLabel: "Summit",
    quote:
      "Onboarding new instructors is effortless now. The permission system just makes sense, and our admins finally trust the tool.",
    tags: ["Education", "Growth"],
  },
  {
    name: "Jordan Blake",
    role: "Curriculum Manager",
    company: "Vector Institute",
    avatarInitials: "JB",
    logoLabel: "Vector",
    quote:
      "We migrated three cohorts over in a single weekend without a single support call. The platform just held up under real load.",
    tags: ["Higher Ed", "Enterprise"],
  },
  {
    name: "Sofia Alvarez",
    role: "Student Success Lead",
    company: "Lumen Online",
    avatarInitials: "SA",
    logoLabel: "Lumen",
    quote:
      "Students actually mention the interface in feedback surveys, unprompted. It feels less like software and more like part of the course.",
    tags: ["Online Learning", "Mid-Size"],
  },
  {
    name: "Ethan Ward",
    role: "IT Administrator",
    company: "Cascade University",
    avatarInitials: "EW",
    logoLabel: "Cascade",
    quote:
      "Security review took a single meeting. Everything we needed for compliance was already documented and ready to go.",
    tags: ["Higher Ed", "Enterprise"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-background px-6 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
          >
           <span className="relative flex size-2 shrink-0" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-primary/40" />
                <span className="relative size-2 rounded-full bg-primary" />
              </span>
            Testimonials
          </Badge>

          <h2
            id="testimonials-heading"
            className="font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            Loved by teams who teach
          </h2>

          <p className="text-lg leading-8 text-muted-foreground">
            See how learning teams of every size use our platform to build,
            manage, and scale better courses.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={itemVariants} className="h-full">
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}