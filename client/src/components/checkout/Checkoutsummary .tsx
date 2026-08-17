import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Order } from "@/src/types/interfaces/order.interface";

export interface CheckoutOrder {
  order?: Order | null
}

interface LineItemProps {
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
}

function LineItem({ label, value, muted = false, highlight = false }: LineItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          muted
            ? "text-sm text-muted-foreground"
            : highlight
              ? "text-base font-semibold text-foreground"
              : "text-sm text-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          muted
            ? "text-sm text-muted-foreground"
            : highlight
              ? "text-base font-bold text-foreground"
              : "text-sm font-medium text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function CheckoutSummary({ order }: CheckoutOrder) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="border-border bg-card shadow-sm min-h-[415px]">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-base font-semibold text-foreground">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-5">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {order?.course?.thumbnail?.url ? (
                <Image
                  src={order.course.thumbnail.url}
                  alt={`${order.course.title} thumbnail`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold leading-5 text-foreground">
                {order?.course.title}
              </span>
              <span className="text-sm text-muted-foreground">
                by {order?.course.instructor.fullName}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Order #{order?.id}
              </span>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex flex-col gap-3">
            <LineItem
              label="Course price"
              value={formatCurrency(order?.totalAmount ?? 0)}
            />
            <LineItem label="Tax" value={String(0)} muted />
          </div>

          <Separator className="bg-border" />

          <LineItem
            label="Total"
            value={formatCurrency(order?.totalAmount ?? 0)}
            highlight
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}