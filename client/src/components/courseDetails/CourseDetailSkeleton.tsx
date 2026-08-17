import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

function CourseHeroSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      {/* Two-column hero */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full max-w-[65ch]" />
            <Skeleton className="h-5 w-3/4 max-w-[65ch]" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </div>
  );
}

function CourseStatsSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="grid grid-cols-2 divide-y divide-border p-0 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-5">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CourseDescriptionSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full max-w-[75ch]" />
          <Skeleton className="h-5 w-5/6 max-w-[75ch]" />
          <Skeleton className="h-5 w-4/6 max-w-[75ch]" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-28" />
        <div className="flex flex-col gap-2 pl-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseCurriculumSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="rounded-lg border border-border bg-card px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            {sectionIndex === 0 ? (
              <div className="mt-4 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-2">
                    <Skeleton className="h-4 w-4 shrink-0 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-10 shrink-0" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseInstructorSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-40" />
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full max-w-[65ch]" />
              <Skeleton className="h-4 w-5/6 max-w-[65ch]" />
              <Skeleton className="h-4 w-4/6 max-w-[65ch]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-12" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CourseSidebarSkeleton() {
  return (
    <div className="lg:sticky lg:top-24">
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <Skeleton className="aspect-video w-full rounded-none" />
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-11 w-full rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 flex-1 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CourseDetailLoading() {
  return (
   <div className="mx-auto min-w-0 w-full mt-24 grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_360px] lg:items-start lg:px-8 lg:py-5">
  <div className="flex flex-col gap-8">
        <CourseHeroSkeleton />
        <CourseDescriptionSkeleton />
        <CourseCurriculumSkeleton />
        <CourseInstructorSkeleton />
        <CourseReviewsSkeleton />
      </div>
      <CourseSidebarSkeleton />
    </div>
  );
}