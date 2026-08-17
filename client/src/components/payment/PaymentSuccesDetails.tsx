"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Payment } from "@/src/types/interfaces/payment.interface";

export interface PaymentDetailsData {
  payment: Payment | null
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function PaymentSuccessDetails({ payment }: PaymentDetailsData) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.35 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-base font-semibold text-foreground">
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3">
            <DetailRow
              label="Payment ID"
              value={
                <span className="font-mono text-xs text-muted-foreground">
                  {payment?.id}
                </span>
              }
            />
            <DetailRow
              label="Order ID"
              value={
                <span className="font-mono text-xs text-muted-foreground">
                  {payment?.order.id}
                </span>
              }
            />
            <DetailRow label="Course" value={payment?.order.course.title} />
          </div>

          <Separator className="bg-border" />

          <div className="flex flex-col gap-3">
            <DetailRow
              label="Amount Paid"
              value={
                <span className="text-base font-bold text-foreground">
                  {formatCurrency(payment?.amount ?? 0)}
                </span>
              }
            />
            <DetailRow label="Payment Method" value={payment?.paymentMethod} />
            <DetailRow
              label="Payment Date"
              value={
                payment?.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString()
                  : "—"
              }
            />
            <DetailRow
              label="Status"
              value={
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/20 bg-primary/10 font-medium text-primary"
                >
                  <BadgeCheck className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                  Paid
                </Badge>
              }
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}