"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  GraduationCap,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { orderService } from "@/src/services/order.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError } from "@/src/components/ui/toaster";
import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/src/services/admin.service";
import RevenueOverviewChart from "@/src/components/admin/dashboard/RevenueOverviewChart";
import OrdersOverviewChart from "@/src/components/admin/dashboard/OrderOverviewChart";
import EnrollmentOverviewChart from "@/src/components/admin/dashboard/EnrollmentOverviewChart";
import OrdersTable from "@/src/components/admin/dashboard/OrderTable";
import StatWidget from "@/src/components/admin/dashboard/StatsWidget";
import { AdminStats } from "@/src/types/interfaces/admin.interface";
import { Order } from "@/src/types/interfaces/order.interface";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";


interface RevenuePoint {
  label: string;
  revenue: number;
}

interface OrdersPoint {
  label: string;
  orders: number;
}

interface EnrollmentPoint {
  label: string;
  enrollments: number;
}

interface StatWidgetProps {
  label: string;
  value: number;
  supportingText: string;
  icon: LucideIcon;
}

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


export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [orderData, setOrderData] = useState<OrdersPoint[]>([])
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentPoint[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)

  const fetchAdminAnalytics = useCallback(
    async () => {
      setIsLoading(true)
      try {
        const [orders, admin] = await Promise.all([
          orderService.getAll(),
          adminService.getMetrics()
        ]);
        setOrders(orders);
        setRevenueData(admin.revenueData)
        setOrderData(admin.orderData)
        setStats(admin.stats)
        setEnrollmentData(admin.enrollmentData)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;

        const errorMessage =
          axiosError.response?.data.message ?? "aSomething went wrong";

        console.error(errorMessage);

        showError("Something went wrong", errorMessage);
      } finally {
        setIsLoading(false)
      }
    }
    , [])

  useEffect(() => {
    fetchAdminAnalytics()
  }, [fetchAdminAnalytics])

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

  const statWidgets: StatWidgetProps[] = [
    {
      label: "Total Revenue",
      value: stats?.totalRevenue ?? 0,
      supportingText: "All time",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      supportingText: "All time",
      icon: ShoppingCart,
    },
    {
      label: "Total Enrollments",
      value: stats?.totalEnrollments ?? 0,
      supportingText: "All time",
      icon: GraduationCap,
    },
    {
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
      supportingText: "All time",
      icon: Users,
    },
  ];
  // if (isLoading) {
  //   return (
  //     <AnalyticsLoading />
  //   )
  // }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1 max-w-4xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="text-base text-muted-foreground">
          Monitor platform performance, sales, enrollments, and student activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
           Array.from({ length: 4 }).map((_, i) => (
          <StatWidgetSkeleton key={i} />
        ))
        ) : (
          statWidgets.map((widget) => (
            <StatWidget key={widget.label} {...widget} />
          ))
        )}
      </div>

      {isLoading ? (
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
      ) : (
        <>
          <RevenueOverviewChart data={revenueData} />
        </>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
        {isLoading ? (
          <>
          <SmallChartSkeleton />
        <SmallChartSkeleton />
          </>
        ) : (
          <>
            <OrdersOverviewChart data={orderData} />
            <EnrollmentOverviewChart data={enrollmentData} />
          </>
        )}
      </div>
      <div className="min-w-0">
        {isLoading?(
          <OrdersTableSkeleton />
        ):(
        <OrdersTable data={orders} />
        )}
      </div>
    </motion.div>
  );
}