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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { createCourseSchema } from "@/src/Schemas/course.schema";
import { Instructor } from "@/src/types/interfaces/user.interface";
import { courseService } from "@/src/services/course.service";
import type { Variants } from "framer-motion";
import type { Transition } from "framer-motion";
import { showError, showSuccess } from "../ui/toaster";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { CourseLevels } from "@/src/types/enums/course.enum";

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


export type CourseFormValues = z.input<typeof createCourseSchema>;

const defaultValues = {
  title: "",
  tagline: "",
  description: "",
  instructor: "",
  level: CourseLevels.BEGINNER,
  price: 0,
  category: "",
  isPublished: false,
  learningOutcomes: "",
  requirements: "",
  thumbnail: undefined,
} satisfies Partial<CourseFormValues>;


const cardVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const buttonTap = { scale: 0.97 };
const buttonHover = { scale: 1.02 };
const buttonTransition:Transition = { duration: 0.15, ease: "easeOut" };

interface CourseFormProps {
  instructors?: Instructor[] | []
}

export function CourseCreateForm({ instructors }: CourseFormProps) {
  const router = useRouter()
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues,
  });

  const { isSubmitting, errors } = form.formState;

  async function onSubmit(data: CourseFormValues) {
    try {
     await courseService.create(data)
      showSuccess("Succesfully created the course")
      router.push("/admin/courses")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Error in creating course", errorMessage);
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <Card className="rounded-2xl border-border shadow-md">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Create Course
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below to publish a new course.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">

            {/* Title */}
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

            {/* Tagline */}
            <Controller
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tagline">Tagline</FormLabel>
                  <Textarea
                    id="tagline"
                    placeholder="A short, compelling description of the course."
                    className="min-h-20 resize-y"
                    {...field}
                  />
                  <FormMessage>{errors.tagline?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
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

            {/* Instructor + Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="instructor">Level</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="instructor">
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CourseLevels).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.instructor?.message}</FormMessage>
                  </FormItem>
                )}
              />
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

              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Category</FormLabel>

                    <Input
                      id="category"
                      placeholder="Enter category"
                      {...field}
                    />

                    <FormMessage>{errors.category?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Price */}
            <Controller
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="price">Price (USD)</FormLabel>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    max={9999}
                    step={0.01}
                    placeholder="0.00"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <FormMessage>{errors.price?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Thumbnail */}
            <Controller
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ref, name, onBlur } }) => (
                <FormItem>
                  <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
                  <Input
                    id="thumbnail"
                    ref={ref}
                    name={name}
                    type="file"
                    accept="image/*"
                    aria-describedby="thumbnail-hint"
                    onBlur={onBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file ?? undefined);
                    }}
                  />
                  {value instanceof File && value.size > 0 && (
                    <p id="thumbnail-hint" className="text-xs text-muted-foreground">
                      Selected: {value.name}
                    </p>
                  )}
                  <FormMessage>{errors.thumbnail?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="learningOutcomes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Outcomes</FormLabel>
                  <Input
                    placeholder="e.g. Understand TypeScript generics"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage>{errors.learningOutcomes?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Requirements */}
            <Controller
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <Input
                    placeholder="e.g. Basic JavaScript knowledge"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage>{errors.requirements?.message}</FormMessage>
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
                      Students can enroll as soon as the course is created.
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
                    Creating…
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" strokeWidth={1.75} />
                    Create Course
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

export default CourseCreateForm;