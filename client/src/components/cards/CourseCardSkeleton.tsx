import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border bg-card p-0 shadow-sm">
      {/* Thumbnail */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
        </div>

        {/* Rating */}

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-4 border-t border-border pt-3">
          <Skeleton className="h-3.5 w-20" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border p-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function CourseCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return ( 
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
     </div>
  );
} 