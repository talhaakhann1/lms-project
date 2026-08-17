import { LucideIcon } from "lucide-react";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface OrderPoint {
  label: string;
  orders: number;
}

export interface EnrollmentPoint {
  label: string;
  enrollments: number;
}


export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalEnrollments: number;
  totalStudents: number;
}

export interface AdminMetrics {
  revenueData: RevenuePoint[];
  orderData: OrderPoint[];
  enrollmentData: EnrollmentPoint[];
   stats: AdminStats
}