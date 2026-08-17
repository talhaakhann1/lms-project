import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function FieldSkeleton({ textareaRows = 0 }: { textareaRows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className={textareaRows > 0 ? `h-${textareaRows} w-full` : "h-9 w-full"} />
    </div>
  );
}



export function CourseFormSkeleton() {
  return (
    <Card className="rounded-2xl border-border shadow-md">
      {/* Header */}
      <CardHeader className="space-y-1 pb-6">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Title */}
        <FieldSkeleton />

        {/* Tagline */}
        <FieldSkeleton textareaRows={20} />

        {/* Description */}
        <FieldSkeleton textareaRows={28} />

        {/* Instructor + Category */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        {/* Price */}
        <FieldSkeleton />

        {/* Thumbnail */}
        <FieldSkeleton />

        {/* Learning Outcomes */}
        <FieldSkeleton  />

        {/* Requirements */}
        <FieldSkeleton  />

        {/* Published switch */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
        <Skeleton className="h-9 w-full rounded-md sm:w-20" />
        <Skeleton className="h-9 w-full rounded-md sm:w-32" />
      </CardFooter>
    </Card>
  );
}

export default CourseFormSkeleton;