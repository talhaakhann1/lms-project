"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  avatarInitials: string;
  quote: string;
  tags: string[];
  logoLabel?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, role, company, avatarUrl, avatarInitials, quote, tags, logoLabel } =
    testimonial;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="flex h-full flex-col gap-4 border-border bg-card p-2 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 pb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-border">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={`${name} avatar`} />
              ) : null}
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {name}
              </span>
              <span className="text-sm text-muted-foreground">
                {role} at {company}
              </span>
            </div>
          </div>
          {logoLabel ? (
            <span
              className="hidden shrink-0 text-sm font-semibold text-muted-foreground/70 sm:block"
              aria-hidden="true"
            >
              {logoLabel}
            </span>
          ) : null}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label="Rated 5 out of 5 stars"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4 fill-primary text-primary"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ))}
          </div>

          <p className="text-sm leading-6 text-foreground">
            &ldquo;{quote}&rdquo;
          </p>

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}