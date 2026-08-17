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
import AnalyticsLoading from "./loading";


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
  if (isLoading) {
    return (
      <AnalyticsLoading />
    )
  }
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
        {statWidgets.map((widget) => (
          <StatWidget key={widget.label} {...widget} />
        ))}
      </div>

      <RevenueOverviewChart data={revenueData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
        <OrdersOverviewChart data={orderData} />
        <EnrollmentOverviewChart data={enrollmentData} />
      </div>
      <div className="min-w-0">
        <OrdersTable data={orders} />
      </div>
    </motion.div>
  );
}