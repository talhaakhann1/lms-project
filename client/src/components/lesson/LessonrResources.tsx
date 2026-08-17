"use client";

import { motion } from "framer-motion";
import { FileText, Code2, Presentation, ExternalLink, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export type ResourceType = "pdf" | "source" | "slides" | "link";

export interface LessonResource {
  type: ResourceType;
  title: string;
  description: string;
  href: string;
}

export interface LessonResourcesProps {
  resources?: LessonResource[];
}

const iconByType: Record<ResourceType, LucideIcon> = {
  pdf: FileText,
  source: Code2,
  slides: Presentation,
  link: ExternalLink,
};

const labelByType: Record<ResourceType, string> = {
  pdf: "PDF",
  source: "Source Code",
  slides: "Slides",
  link: "External Link",
};

const defaultResources: LessonResource[] = [
  {
    type: "pdf",
    title: "Lesson notes",
    description: "A printable summary of this lesson's key concepts.",
    href: "/resources/lesson-notes.pdf",
  },
  {
    type: "source",
    title: "Starter repository",
    description: "The exact codebase used throughout this lesson.",
    href: "https://github.com/example/lesson-starter",
  },
  {
    type: "slides",
    title: "Presentation slides",
    description: "Slide deck covering the lesson walkthrough.",
    href: "/resources/lesson-slides.pdf",
  },
  {
    type: "link",
    title: "Further reading",
    description: "An external article that expands on this topic.",
    href: "https://example.com/further-reading",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function LessonResources({ resources = defaultResources }: LessonResourcesProps) {
  return (
    <section aria-labelledby="lesson-resources-heading" className="flex flex-col gap-4">
      <h2
        id="lesson-resources-heading"
        className="font-display text-xl font-semibold tracking-tight text-foreground"
      >
        Lesson Resources
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {resources.map((resource) => {
          const Icon = iconByType[resource.type];
          const isExternal = resource.type === "link" || resource.type === "source";

          return (
            <motion.div key={resource.title} variants={itemVariants}>
              <Card className="flex h-full flex-col gap-3 border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex flex-1 flex-col gap-3 p-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {labelByType[resource.type]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-foreground">
                      {resource.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-fit gap-1.5 font-medium"
                  >
                    <a
                      href={resource.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                    >
                      Open
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}