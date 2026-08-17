import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

function LessonHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full max-w-[70ch]" />
          <Skeleton className="h-5 w-4/5 max-w-[70ch]" />
        </div>
      </div>

      {/* Meta row: duration, level, date, badge */}
      <div className="flex flex-wrap items-center gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

function LessonVideoPlayerSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function LessonContentSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* h2 */}
      <Skeleton className="h-8 w-32" />
      {/* paragraph */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full max-w-[70ch]" />
        <Skeleton className="h-5 w-5/6 max-w-[70ch]" />
        <Skeleton className="h-5 w-4/6 max-w-[70ch]" />
      </div>
      {/* h3 */}
      <Skeleton className="h-7 w-44" />
      {/* list */}
      <div className="flex flex-col gap-3 pl-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
      </div>
      {/* callout */}
      <Skeleton className="h-16 w-full rounded-lg" />
      {/* h3 */}
      <Skeleton className="h-7 w-36" />
      {/* code block */}
      <Skeleton className="h-28 w-full rounded-lg" />
      {/* paragraph */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full max-w-[70ch]" />
        <Skeleton className="h-5 w-2/3 max-w-[70ch]" />
      </div>
      {/* blockquote */}
      <div className="flex gap-4">
        <Skeleton className="h-full w-0.5 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

function LessonResourcesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-36" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LessonNavigationSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
      <Card className="border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </Card>
      <Card className="border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-end gap-3">
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-5 w-5 shrink-0" />
        </div>
      </Card>
    </div>
  );
}

function LessonSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Progress card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="gap-1 p-4 pb-0">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>

      {/* Lesson list card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="p-4 pb-0">
          <Skeleton className="h-5 w-16" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2.5">
                <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-3 w-10 shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LessonLoading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <LessonHeaderSkeleton />
        <LessonVideoPlayerSkeleton />
        <LessonContentSkeleton />
        <LessonResourcesSkeleton />
        <LessonNavigationSkeleton />
      </div>

      <LessonSidebarSkeleton />
    </div>
  );
}