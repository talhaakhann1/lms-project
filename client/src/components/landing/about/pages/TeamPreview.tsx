"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";

interface TeamMember {
  name: string;
  role: string;
  avatarSrc?: string;
  initials: string;
}

const defaultTeam: TeamMember[] = [
  {
    name: "Talha Khan",
    role: "Co-Founder & CEO",
    avatarSrc: "/images/avatars/talha-khan.jpg",
    initials: "TK",
  },
  {
    name: "Ayaan Malik",
    role: "Co-Founder & CTO",
    avatarSrc: "/images/avatars/ayaan-malik.jpg",
    initials: "AM",
  },
  {
    name: "Sara Ahmed",
    role: "Head of Product",
    avatarSrc: "/images/avatars/sara-ahmed.jpg",
    initials: "SA",
  },
  {
    name: "Hamza Ali",
    role: "Head of Design",
    avatarSrc: "/images/avatars/hamza-ali.jpg",
    initials: "HA",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export interface TeamPreviewProps {
  heading?: string;
  description?: string;
  members?: TeamMember[];
}

export function TeamPreview({
  heading = "Meet the team",
  description = "A small, focused team building the platform end to end.",
  members = defaultTeam,
}: TeamPreviewProps) {
  return (
    <section
      aria-labelledby="team-heading"
      className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2
          id="team-heading"
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
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
      >
        {members.map((member) => (
          <motion.div
            key={member.name}
            variants={cardVariants}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <Avatar className="size-20 border border-border shadow-sm sm:size-24">
              <AvatarImage src={member.avatarSrc} alt="" />
              <AvatarFallback className="bg-secondary text-base font-semibold text-secondary-foreground">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default TeamPreview;