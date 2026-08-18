
import { motion } from "framer-motion";
import { MoreHorizontal, Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { Review } from "@/src/types/interfaces/review.interface";
import { Button } from "../ui/button";
import { Course } from "@/src/types/interfaces/course.interface";
import {
  Dialog,
  DialogContent,
} from "../ui/dialog"
import ReviewCreateForm, { ReviewFormValues } from "../review/CreateReviewModel";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { User } from "@/src/types/interfaces/user.interface";
import { ReviewCardSkeleton } from "../review/ReviewCardSkeleton";


export interface CourseReviewsProps {
  user?: User | null
  course?: Course | null
  loading?: boolean
  reviews?: Review[];
  role?: string | null;
  onCreateReview?: (data: ReviewFormValues, courseId: string) => Promise<void>;
  onDeleteReview?: (reviewId: string) => Promise<void>
}



export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};



function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRow({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={
            index < Math.round(rating)
              ? "h-4 w-4 fill-primary text-primary"
              : "h-4 w-4 text-muted-foreground"
          }
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};



export function CourseReviews({ reviews, course, user, role, onCreateReview, onDeleteReview, loading }: CourseReviewsProps) {
  const handleDeleteReview = async (reviewId: string) => {
    await onDeleteReview?.(reviewId)
  }

  const [reviewOpen, setReviewOpen] = React.useState(false);
  return (
    <section>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-labelledby="course-reviews-heading"
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="course-reviews-heading"
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Student Reviews
          </h2>
          {role == "student" && course?.isEnrolled && (
            <Button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="w-fit"
            >
              Write a Review
            </Button>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-4"
        >
          {loading ? (
            <ReviewCardSkeleton />
          ) :
            reviews?.length === 0 ? (
              <div className=" p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Share your experience by writing the first review.
                </p>
              </div>
            ) :
              (
                reviews?.map((review) => (
                  <motion.div key={review.id} variants={itemVariants}>
                    <Card className="border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
                      <CardContent className="flex flex-col gap-3 ">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0 border border-border">
                            {review.user?.avatar ? (
                              <AvatarImage
                                src={review.user.avatar.url}
                                alt={`${review.user.fullName} avatar`}
                              />
                            ) : null}

                            <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                              {getInitials(review.user?.fullName ?? "")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-foreground">
                              {review.user?.fullName}
                            </span>

                            <span className="block text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                          {review.user?.id === user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Review actions"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                }
                              />

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                  onClick={() => handleDeleteReview(review?.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>


                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}

        </motion.div>
      </motion.section>
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg bg-card">
          <ReviewCreateForm
            onSubmit={async (data) => {
              await onCreateReview?.(data, course?.id as string);
              setReviewOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}