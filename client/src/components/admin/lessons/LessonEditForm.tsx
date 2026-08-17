"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, RotateCcw, PlusCircle } from "lucide-react";
import type { Variants } from "framer-motion";
import type { Transition } from "framer-motion";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "../../ui/switch";
import { createCourseSchema, updateCourseSchema } from "@/src/Schemas/course.schema";
import { User } from "@/src/Schemas/user.schema";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { courseService } from "@/src/services/course.service";
import { showError, showSuccess } from "../../ui/toaster";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { CourseLevels } from "@/src/types/enums/course.enum";
import { Course } from "@/src/types/interfaces/course.interface";
import { Lesson } from "@/src/types/interfaces/lesson.interface";
import { updateLessonSchema } from "@/src/Schemas/lession.scehma";
import { lessonService } from "@/src/services/lesson.service";
import { useParams } from "next/navigation";

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

export type LessonFormValues = z.input<typeof updateLessonSchema>;

const cardVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const buttonTap = { scale: 0.97 };
const buttonHover = { scale: 1.02 };
const buttonTransition:Transition = { duration: 0.15, ease: "easeOut" };

interface LessonFormProps {
  lesson?: Lesson | null,
  instructors?: Instructor[] | [],
}

export function LessonEditForm({ lesson, instructors }: LessonFormProps) {
  const router = useRouter()
  const params=useParams()
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(updateLessonSchema),
    defaultValues: {
      title: lesson?.title,
      description: lesson?.description,
      body:lesson?.body,
      instructor: lesson?.instructor.id,
      order: lesson?.order,
      isPublished: lesson?.isPublished,
    },
  });

  const lessonId = lesson?.id as string
  const courseId=params.courseId

  const { isSubmitting, errors } = form.formState;

  async function onSubmit(data: LessonFormValues) {
    try {
      await lessonService.update(lessonId, data)
      showSuccess("Succesfully updated the course")
      router.push(`/admin/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError("Error in editing lesson", errorMessage);
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <Card className="rounded-2xl border-border shadow-md">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Edit Lessons
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below to edit the lesson.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">

            <Controller
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input
                    id="title"
                    placeholder="e.g. Advanced TypeScript Patterns"
                    {...field}
                  />
                  <FormMessage>{errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    placeholder="What will students learn in this course?"
                    className="min-h-28 resize-y"
                    {...field}
                  />
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="body">Reading body</FormLabel>
                  <Textarea
                    id="body"
                    placeholder="What will students learn in this lesson?"
                    className="min-h-28 resize-y"
                    {...field}
                  />
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <strong>Markdown supported:</strong>{" "}
                    <code>#</code> Heading,&nbsp;
                    <code>##</code> Subheading,&nbsp;
                    <code>**text**</code> Bold,&nbsp;
                    <code>*text*</code> Italic,&nbsp;
                    <code>-</code> or <code>1.</code> Lists,&nbsp;
                    <code>&gt;</code> Quote,&nbsp;
                    <code>`code`</code> Inline code,&nbsp;
                    <code>```</code> Code block,&nbsp;
                    <code>[text](url)</code> Link,&nbsp;
                    <code>![alt](url)</code> Image,&nbsp;
                    <code>---</code> Horizontal rule.
                  </p>
                  <FormMessage>{errors.body?.message}</FormMessage>
                </FormItem>
              )}
            />


            {/* Instructor */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="instructor">Instructor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="instructor">
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors?.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.instructor?.message}</FormMessage>
                  </FormItem>
                )}
              />


            </div>

            <Controller
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="order">Lesson Order</FormLabel>

                  <Input
                    id="order"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="1"
                    value={Number(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />


            <Controller
              control={form.control}
              name="video"
              render={({ field: { value, onChange, ref, name, onBlur } }) => (
                <FormItem>
                  <FormLabel htmlFor="video">Upload Video</FormLabel>

                  <Input
                    id="video"
                    ref={ref}
                    name={name}
                    type="file"
                    accept="video/*"
                    onBlur={onBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                  />

                  {value instanceof File && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {value.name}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published switch */}
            <Controller
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex mb-4 items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Publish immediately
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Students can enroll as soon as the lesson is created.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-label="Publish immediately"
                  />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
            <motion.div whileHover={buttonHover} whileTap={buttonTap} transition={buttonTransition}>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => form.reset()}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Reset
              </Button>
            </motion.div>

            <motion.div whileHover={buttonHover} whileTap={buttonTap} transition={buttonTransition}>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                    Updating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" strokeWidth={1.75} />
                    Update Lesson
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div >
  );
}

export default LessonEditForm;