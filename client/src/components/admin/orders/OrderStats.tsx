"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  CircleCheckIcon,
  CircleDollarSignIcon,
  ClockIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Skeleton } from "../../../components/ui/skeleton";

import {
  formatFullCurrency,
  formatInteger,
} from "@/src/lib/formatter";

import type { Order } from "@/src/types/interfaces/order.interface";

interface OrderStat {
  key: string;
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

interface OrderStatsProps {
  orders: Order[];
  isLoading?: boolean;
}

function buildStats(orders: Order[]): OrderStat[] {
  const totalOrders = orders.length;

  const paidOrders = orders.filter((order) => order.isPaid);

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const pendingOrders = orders.filter(
    (order) => !order.isPaid
  ).length;

  const completedOrders = paidOrders.length;

  return [
    {
      key: "total",
      title: "Total Orders",
      value: formatInteger(totalOrders),
      description: "All orders placed to date",
      icon: ShoppingCartIcon,
    },
    {
      key: "revenue",
      title: "Total Revenue",
      value: formatFullCurrency(totalRevenue),
      description: "Revenue from paid orders",
      icon: CircleDollarSignIcon,
    },
    {
      key: "pending",
      title: "Pending Orders",
      value: formatInteger(pendingOrders),
      description: "Awaiting payment",
      icon: ClockIcon,
    },
    {
      key: "paid",
      title: "Paid Orders",
      value: formatInteger(completedOrders),
      description: "Successfully paid orders",
      icon: CircleCheckIcon,
    },
  ];
}

export function OrderStats({
  orders,
  isLoading = false,
}: OrderStatsProps) {
  const stats = useMemo(() => buildStats(orders), [orders]);

  const reduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <section aria-label="Order statistics">
        <h2 className="sr-only">Order statistics</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`order-stat-skeleton-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="size-4" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="mt-2 h-4 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Order statistics">
      <h2 className="sr-only">Order statistics</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: index * 0.05,
            }}
            whileHover={
              reduceMotion ? undefined : { y: -4 }
            }
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: OrderStat }) {
  const {
    title,
    value,
    description,
    icon: Icon,
  } = stat;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>

        <Icon
          className="size-4 text-muted-foreground"
          strokeWidth={1.75}
        />
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {value}
        </div>

        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default OrderStats;