"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Lock, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/store/hook";

import { Button } from "../../components/ui/button";

import {
  LessonHeader,
  type LessonStatusFilter,
} from "../../components/lessonList/LessonHeader";
import { LessonEmpty } from "../../components/lessonList/Lessonempty";
import { LessonSkeleton } from "../../components/lessonList/Lessonskeleton";


import { Clock, PlayCircle, Video } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";


import { Lesson } from "@/src/types/interfaces/lesson.interface";
import { Course } from "@/src/types/interfaces/course.interface";


type LessonStatus = "available" | "locked";

export interface LessonListItemProps {
  lesson?: Lesson | null;
  isEnrolled?: boolean;
  role: string | null;
  onSelect?: (lesson: Lesson) => void;
  className?: string;
}

export const lessonItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const statusConfig: Record<
  LessonStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  locked: {
    label: "Locked",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function formatUpdatedAt(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function LessonListItem({
  lesson,
  onSelect,
  isEnrolled,
  role,
  className,
}: LessonListItemProps) {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId
  const isLocked = !isEnrolled;
  const status: LessonStatus = isLocked ? "locked" : "available";
  const statusConfigItem = statusConfig[status];

  const handleOnClick = () => {

    if (!isEnrolled) return;

    router.push(
      role === "admin"
        ? `/admin/courses/${courseId}/lessons/${lesson?.id}`
        : `/dashboard/courses/${courseId}/lessons/${lesson?.id}`
    );

  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if ((event.key === "Enter" || event.key === " ") && lesson) {
      event.preventDefault();
      onSelect?.(lesson);
    }
  };

  return (
    <motion.div
      variants={lessonItemVariants}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      <Card
        role="button"
        tabIndex={0}
        aria-label={`${lesson?.title ?? "Lesson"}, lesson ${lesson?.order ?? ""
          }, ${statusConfigItem.label}`}
        onClick={handleOnClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "cursor-pointer flex flex-col gap-4 rounded-xl border-border p-4 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
          "hover:border-primary/30 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isLocked
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        )}
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
          {String(lesson?.order ?? 0).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {lesson?.title}
            </h3>

            <Badge
              variant="outline"
              className={cn("text-xs font-medium", statusConfigItem.className)}
            >
              {statusConfigItem.label}
            </Badge>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {lesson?.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Video className="size-3.5" strokeWidth={1.75} />
              Video
            </span>

            {lesson?.video?.duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" strokeWidth={1.75} />
                {formatDuration(lesson.video.duration)}
              </span>
            )}

            {lesson?.updatedAt && (
              <span className="inline-flex items-center gap-1.5">
                Updated {formatUpdatedAt(lesson.updatedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end sm:justify-center">
          {isLocked ? (
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Lock className="size-4.5" strokeWidth={1.75} />
            </span>
          ) : (
            <span className="flex size-9 items-center justify-center rounded-full text-primary transition-colors group-hover:bg-primary/10">
              <PlayCircle className="size-6" strokeWidth={1.5} />
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// export default LessonListItem;

export interface LessonListProps {
  lessons?: Lesson[];
  courseId?: string;
  onClick?: (lessonId: string) => void
  isLoading?: boolean;
  role?: string | null;
  isEnrolled?: boolean;
  title?: string;
  description?: string;
  onSelectLesson?: (lesson: Lesson) => void;
  onCreateLesson?: () => void;
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export function LessonList({
  lessons = [],
  isLoading = false,
  courseId,
  isEnrolled,
  role,
  onClick,
  onSelectLesson,
  className,
}: LessonListProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<LessonStatusFilter>("available");

  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const filteredLessons = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesQuery =
        query === "" ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && !lesson.isCompleted) ||
        (statusFilter === "locked" &&!lesson.isEnrolled);

      return matchesQuery && matchesStatus;
    });
  }, [lessons, search, statusFilter]);

  const hasActiveSearch =
    search.trim().length > 0 || statusFilter !== "all";

  const handleClearSearch = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <section
      aria-labelledby="lesson-list-heading"
      className={cn("mx-auto w-full max-w-3xl", className)}
    >
      <div className="mb-6 flex items-center justify-between">
        <LessonHeader
          totalCount={lessons.length}
          visibleCount={filteredLessons.length}
          searchValue={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

      </div>

      {isLoading ? (
        <LessonSkeleton count={5} />
      ) : filteredLessons.length === 0 ? (
        <LessonEmpty
          variant={hasActiveSearch ? "no-results" : "no-lessons"}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 sm:gap-4"
        >
          {filteredLessons.map((lesson) => (
            <LessonListItem
              isEnrolled={isEnrolled}
              role={role ?? null}
              key={lesson?.id}
              lesson={lesson}
              onSelect={onSelectLesson}
            />
          ))}
        </motion.div>
      )}
      {user?.role === "admin" && (
        <Button
          onClick={() => router.push(`/admin/courses/${courseId}/lessons/create`)}
          className=" shrink-0 gap-2 mt-4"
        >
          <Plus className="h-4 w-4" />
          Add Lesson
        </Button>
      )}
    </section>
  );
}

export default LessonList;