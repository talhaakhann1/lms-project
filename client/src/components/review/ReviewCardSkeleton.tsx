import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

export function ReviewCardSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex flex-col gap-3 p-5">
       
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Comment text */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}