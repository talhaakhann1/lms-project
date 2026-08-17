import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

function CheckoutSummarySkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-5 pb-0">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Course row */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-24 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Line items */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentSectionSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-5 pb-0">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Secure badge */}
        <Skeleton className="h-12 w-full rounded-lg" />

        {/* Stripe wordmark */}
        <div className="flex items-center justify-center gap-2 py-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>

        <Separator className="bg-border" />

        {/* Button + note */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="mx-auto h-3 w-64" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutLoading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10 lg:px-8 lg:py-5">
      {/* Page heading */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <CheckoutSummarySkeleton />
        <PaymentSectionSkeleton />
      </div>
    </main>
  );
}