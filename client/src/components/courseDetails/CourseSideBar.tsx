"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Book, Share2, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Course } from "@/src/types/interfaces/course.interface";
import { useRouter } from "next/navigation";
import { orderService } from "@/src/services/order.service";
import { showError, showInfo, showSuccess } from "../ui/toaster";

export interface CourseSidebarProps {
  course?: Course | null;
  role?: string
  actionLoading?: boolean;
  onDelete?: (courseId: string) => Promise<void>
  onBuyNow?: (courseId: string) => Promise<void>;
  onShare?: (courseId: string) => void;
  onWishlist?: (courseId: string) => void;
}


export function CourseSidebar({
  course,
  role,
  actionLoading,
  onDelete,
  onBuyNow,
  onShare,
  onWishlist,
}: CourseSidebarProps) {
  const router = useRouter()

  const handlBuyNow = async () => {
    if (!role) {
      showInfo(
        "Authentication required",
        "Please sign up or log in to purchase this course."
      );
      router.push("/sign-up");
      return;
    }

    const order = await orderService.create(course?.id as string);

    router.push(`/checkout/${order.id}`);
  };

  const handleStartLearning = () => {
    if (!role) {
      showError(
        "Sign in required",
        "Please sign in to start learning this course."
      );
      router.push("/sign-in");
      return;
    }

    if (role === "admin" || role === "instructor") {
      router.push(`/admin/courses/${course?.id}/lessons`);
      return;
    }

    if (role === "student" && course?.isEnrolled) {
      router.push(`/dashboard/courses/${course?.id}/lessons`);
      return;
    }

    showError(
      "Enrollment required",
      "Please enroll in this course before starting the lessons."
    );
  };

  const handleShare = async (courseId: string) => {
    const shareUrl = `${window.location.origin}/courses/${courseId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: course?.title ?? "Course",
          text: `Check out this course: ${course?.title ?? "Course"}`,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      showSuccess("Course link copied!");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      showError("Unable to share course");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="lg:sticky lg:top-24"
    >
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course?.thumbnail?.url ? (
            <Image
              src={course.thumbnail.url}
              alt={`${course.title} course thumbnail`}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
              No thumbnail available
            </div>
          )}
        </div>

        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground"> {course?.isEnrolled ? "Purchased" : `$${course?.price}`}</span>
            {course?.price ? (
              <span className="text-sm text-muted-foreground line-through">
                ${course?.price}
              </span>
            ) : null}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col gap-3"
          >
            {(!role || (role === "student" && !course?.isEnrolled)) ? (
              <Button
                onClick={handlBuyNow}
                size="lg"
                className="w-full gap-2 font-semibold"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Now
              </Button>
            ) : (
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="w-full gap-2 font-semibold"
              >
                <Book className="h-4 w-4" />
                Start Learning
              </Button>
            )}
          </motion.div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 font-medium"
              onClick={() => handleShare?.(course?.id as string)}
            >
              <Share2
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}