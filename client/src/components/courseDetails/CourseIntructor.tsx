

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { Instructor, User } from "@/src/types/interfaces/user.interface";
import Image from "next/image";


export interface CourseInstructorProps {
  instructor?: Instructor |null;
}

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CourseInstructor({ instructor }: CourseInstructorProps) {

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-labelledby="course-instructor-heading"
      className="flex flex-col gap-4"
    >
      <h2
        id="course-instructor-heading"
        className="font-display text-2xl font-bold tracking-tight text-foreground"
      >
        Your Instructor
      </h2>

      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }}>
        <Card className="border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <Avatar>

              <Avatar>
                <AvatarImage
                  src={instructor?.avatar?.url ?? ""}
                  alt={`${instructor?.fullName} avatar`}
                />
                <AvatarFallback>
                  {instructor?.fullName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {!instructor?.avatar&&(
                <AvatarFallback>
                {getInitials(instructor?.fullName as string)}
              </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-foreground">
                  {instructor?.fullName}
                </span>
                <span className="text-sm text-muted-foreground">{instructor?.title}</span>
              </div>
              <p className="max-w-[65ch] text-sm leading-6 text-muted-foreground">
                {instructor?.bio}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}