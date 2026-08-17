import { Skeleton } from "../../components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

function StatWidgetSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function RevenueOverviewChartSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-[130px] rounded-md" />
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function SmallChartSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-2 p-5 pb-0">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <Skeleton className="h-[220px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function OrdersTableSkeleton() {
  const columnWidths = ["w-20", "w-28", "w-36", "w-16", "w-20", "w-24", "w-20", "w-8"];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-4 p-5 pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-full max-w-xs rounded-md" />
      </CardHeader>

      <CardContent className="p-5">
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columnWidths.map((width, i) => (
                  <th key={i} className="p-3 text-left">
                    <Skeleton className={`h-4 ${width}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border last:border-0">
                  {columnWidths.map((width, cellIndex) => (
                    <td key={cellIndex} className="p-3">
                      <Skeleton className={`h-5 ${width}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatWidgetSkeleton key={i} />
        ))}
      </div>

      <RevenueOverviewChartSkeleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SmallChartSkeleton />
        <SmallChartSkeleton />
      </div>

      <OrdersTableSkeleton />
    </div>
  );
}