import { motion, type Variants } from "framer-motion";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, ArrowRight, Compass } from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Progress } from "../../ui/progress"
import { StatWidgetProps } from "./StatsWidget";
import heroImage from "@/public/images/illustrations/hero-dashboard.webp"
import { Skeleton } from "../../ui/skeleton";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: {
    id: string,
    name: string
  };
  thumbnailUrl: string;
  progressPercent: number;
  currentLesson?: {
    id: string;
    title: string
  };
}


interface DashboardHomeProps {
  studentName: string
  isLoading: boolean | null;
  enrolledCourses?: EnrolledCourse[]
  currentCourse?: EnrolledCourse
  stats: StatWidgetProps[]
}


function EmptyCoursesState() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:py-20"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
        <Compass className="size-6" strokeWidth={1.5} />
      </span>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          No courses yet
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          You haven't enrolled in any courses. Browse the catalog and start
          your first course to see your progress here.
        </p>
      </div>
      <Button>
        <Link className="flex items-center gap-2" href="/dashboard/courses">
          Browse Courses
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Link>
      </Button>
    </motion.div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};


export function DashboardHome({
  studentName,
  enrolledCourses,
  isLoading,
  currentCourse,
  stats
}: DashboardHomeProps) {
  const router = useRouter()
  const hasEnrolled = enrolledCourses?.length ?? 0
  return (
    <div className="flex flex-col gap-14 pb-16">

      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        aria-labelledby="hero-heading"
        className="
    grid min-h-[390px] grid-cols-1 gap-8
    lg:grid-cols-[minmax(0,1fr)_400px]
    lg:gap-12
    xl:grid-cols-[minmax(0,1fr)_440px]
  "
      >
        {/* LEFT */}
        <div className="flex min-w-0 flex-col">
          {isLoading ? (
            <>
              {/* Header skeleton */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-5 w-80 max-w-full" />
              </div>

              {/* Hero content skeleton */}
              <div className="mt-10 flex flex-col items-start gap-4 lg:mt-20">
                <Skeleton className="h-4 w-36" />

                <Skeleton className="h-9 w-[420px] max-w-full" />

                <div className="w-full max-w-md space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="mt-2 flex gap-3">
                  <Skeleton className="h-9 w-40" />
                  <Skeleton className="h-9 w-40" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Welcome back, {studentName}
                </h1>

                <p className="text-sm text-muted-foreground sm:text-base">
                  {hasEnrolled
                    ? "A little progress each day adds up to big results."
                    : "Let's find your first course and get started."}
                </p>
              </div>

              <div className="mt-10 flex flex-col items-start gap-4 lg:mt-20">
                <span className="text-sm font-medium text-primary">
                  {hasEnrolled ? "Continue your journey" : "Get started"}
                </span>

                <h2
                  id="hero-heading"
                  className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl"
                >
                  {hasEnrolled
                    ? "Pick up right where you left off."
                    : "Your learning journey starts here."}
                </h2>

                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {hasEnrolled
                    ? "You're making steady progress. Jump back into your current lesson, or explore something new to add to your learning path."
                    : "Explore our course catalog and enroll in your first course. Once you're enrolled, your progress and next lesson will show up right here."}
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  {hasEnrolled ? (
                    <>
                      <Button>
                        <Link
                          className="flex items-center gap-2"
                          href={
                            currentCourse?.currentLesson
                              ? `/dashboard/courses/${currentCourse.id}/lessons/${currentCourse.currentLesson.id}`
                              : `/dashboard/courses/${enrolledCourses?.[0]?.id}`
                          }
                        >
                          Continue Learning
                          <ArrowRight className="size-4" strokeWidth={1.75} />
                        </Link>
                      </Button>

                      <Button variant="outline">
                        <Link href="/dashboard/courses">
                          Browse More Courses
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button>
                      <Link
                        className="flex items-center gap-2"
                        href="/dashboard/courses"
                      >
                        Browse Courses
                        <ArrowRight className="size-4" strokeWidth={1.75} />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="
      relative hidden
      h-[390px] w-[400px]
      shrink-0 self-center justify-self-end
      lg:block
      xl:h-[410px] xl:w-[440px]
    "
        >
          <Image
            src={heroImage}
            alt="Illustration of a student studying with a laptop and open book"
            fill
            priority
            sizes="(min-width: 1280px) 440px, 400px"
            className="object-contain object-center"
          />
        </div>
      </motion.section>

      <motion.section
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
        aria-label="Learning overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {isLoading ? (
          Array.from({ length: stats.length || 4 }).map((_, index) => (
            <Card
              key={index}
              className="min-w-0 rounded-xl border-border p-5 shadow-sm"
            >
              <CardContent className="flex items-center gap-4 p-0">
                <Skeleton className="size-10 shrink-0 rounded-lg" />

                <div className="space-y-2">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="h-full"
            >
              <Card className="h-full min-w-0 rounded-xl border-border p-5 shadow-sm">
                <CardContent className="flex h-full items-center gap-4 p-0">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <stat.icon className="size-4.5" strokeWidth={1.75} />
                  </span>

                  <div className="min-w-0 space-y-0.5">
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>

                    <p className="text-sm leading-5 text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.section>

      {/* My Courses */}
      <section aria-labelledby="my-courses-heading" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2
            id="my-courses-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            My Courses
          </h2>
          <Link
            href="/dashboard/courses"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-xl border-border p-0 shadow-sm"
              >
                <Skeleton className="aspect-video w-full" />

                <CardContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>

                    <Skeleton className="h-1.5 w-full" />
                  </div>

                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasEnrolled ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {enrolledCourses?.map((course) => (
              <motion.div key={course.id} variants={fadeUp}>
                <Card
                  onClick={() =>
                    router.push(`/dashboard/courses/${course.id}`)
                  }
                  className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border-border p-0 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={course.thumbnailUrl}
                      alt={`${course.title} thumbnail`}
                      fill
                      sizes="(min-width: 1024px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold leading-snug text-foreground">
                        {course.title}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {course.instructor.name}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>

                        <span className="font-medium text-foreground">
                          {course.progressPercent}%
                        </span>
                      </div>

                      <Progress
                        value={course.progressPercent}
                        className="h-1.5"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Currently on: {course.currentLesson?.title}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full justify-between"
                    >
                      {course.currentLesson?.id ? (
                        <Link
                          href={`/dashboard/courses/${course.id}/lessons/${course.currentLesson.id}`}
                          className="flex items-center gap-2"
                        >
                          <span>Continue Learning</span>
                          <ArrowRight
                            className="size-4"
                            strokeWidth={1.75}
                          />
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          Completed
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyCoursesState />
        )}


      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
        aria-label="Motivation"
        className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 px-6 py-12 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="size-5" strokeWidth={1.75} />
        </span>
        <p className="max-w-md text-base font-medium text-foreground">
          {hasEnrolled
            ? "Consistency beats intensity. A focused 20 minutes today keeps you closer to your goal than a rushed hour next week."
            : "Every expert was once a beginner. Enroll in your first course today and take the first step."}
        </p>
      </motion.section>
    </div>
  )
}