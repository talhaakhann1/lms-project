"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, Clock, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Course } from "@/src/types/interfaces/course.interface";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  role?:string|null;
  course: Course|null;
  isLoggedIn?:boolean
}

export function CourseCard({ course,role,isLoggedIn }: CourseCardProps) {
  const router=useRouter()
 const handleOnClick=()=>{
  if (!isLoggedIn) {
    router.push(`/courses/${course?.id}`);
    return;
  }

  if (role === "admin" || role === "instructor") {
    router.push(`/admin/courses/${course?.id}`);
    return;
  }

  router.push(`/dashboard/courses/${course?.id}`);
 }
  return (
    <motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="h-full"
>
  <Card onClick={handleOnClick} className="flex h-full flex-col overflow-hidden border-border bg-card p-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
    <div className="relative aspect-video w-full overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative h-full w-full"
      >
        {
          course?.thumbnail&&(
            <Image
              src={course?.thumbnail?.url}
              alt={`${course?.title} course thumbnail`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )
        }
      </motion.div>

      <Badge
        variant="secondary"
        className="absolute left-3 top-3 bg-secondary text-secondary-foreground"
      >
        {course?.category}
      </Badge>
    </div>

    <CardContent className="flex flex-1 flex-col gap-3 p-4">
      <h3 className="text-xl font-bold leading-6 text-foreground">
        {course?.title}
      </h3>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {course?.description}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage
            src={course?.instructor?.avatar?.url}
            alt={course?.instructor?.fullName}
          />
          <AvatarFallback>
            {course?.instructor?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm text-muted-foreground">
          {course?.instructor?.fullName}
        </span>
      </div>
    </CardContent>

    <CardFooter className="flex items-center justify-between border-t p-4">
      <span className="text-lg font-bold">
        ${course?.price}
      </span>

      {role==="student"&& !course?.isEnrolled?(
         <Button size="sm">
        Enroll Now
      </Button>
      ):(
        <Button size="sm">
        View 
      </Button>
      )}
    </CardFooter>
  </Card>
</motion.div>
  );
}