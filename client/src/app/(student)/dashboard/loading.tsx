import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border-border p-0 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-auto h-9 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export default function StudentDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-14 pb-16">
      {/* Welcome header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Hero */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-full max-w-sm" />
          <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      </div>

      {/* Learning overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-xl border-border p-5 shadow-sm">
            <CardContent className="flex items-center gap-4 p-0">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Courses */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Motivation banner */}
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 px-6 py-12 text-center">
        <Skeleton className="size-12 rounded-full" />
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}