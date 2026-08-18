"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, RotateCcw, PlusCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { showError, showSuccess } from "../ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { createReviewSchema } from "@/src/Schemas/review.schema";
import type { Variants } from "framer-motion";
import type { Transition } from "framer-motion";

function FormItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

function FormLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className={["text-sm font-medium text-foreground", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Label>
  );
}

function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}


export type ReviewFormValues = z.input<typeof createReviewSchema>;



const cardVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const buttonTap = { scale: 0.97 };
const buttonHover = { scale: 1.02 };
const buttonTransition:Transition = { duration: 0.15, ease: "easeOut" };

interface ReviewCreateFormProps {
  onSubmit: (data: ReviewFormValues) => Promise<void>;
}

export function ReviewCreateForm({ onSubmit }: ReviewCreateFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: ""
    },
  });

  const { isSubmitting, errors } = form.formState;


  async function handleSubmit(data: ReviewFormValues) {
  try {
     await onSubmit(data);
     form.reset();
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;

    const errorMessage =
      axiosError.response?.data.message ?? "Something went wrong";

    console.error(errorMessage);

    showError("Something went wrong", errorMessage);
  }
}

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      {/* <Card className="rounded-2xl border-border shadow-md"> */}
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Write Review
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below to publish a new course.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <Controller
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Whats your comment</FormLabel>
                  <Textarea
                    id="description"
                    placeholder="What will students learn in this course?"
                    className="min-h-28 resize-y"
                    {...field}
                  />
                  <FormMessage>{errors.comment?.message}</FormMessage>
                </FormItem>
              )}
            />

          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">

            <motion.div whileHover={buttonHover} whileTap={buttonTap} transition={buttonTransition}>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                    Creating…
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" strokeWidth={1.75} />
                    Add Review
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      {/* </Card> */}
    </motion.div >
  );
}

export default ReviewCreateForm
