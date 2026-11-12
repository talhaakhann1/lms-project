"use client"

import { CheckoutSummary } from "../../../../components/checkout/Checkoutsummary ";
import { PaymentSection } from "../../../../components/checkout/PaymentSection";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError } from "@/src/components/ui/toaster";
import { useParams } from "next/navigation";
import { orderService } from "@/src/services/order.service";
import { Order } from "@/src/types/interfaces/order.interface";
import CheckoutLoading from "@/src/components/checkout/CheckoutSkeleton";


function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CheckoutPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const params = useParams()
  const orderId = params.orderId as string
  console.log(orderId);


  const fetchOrder = useCallback(async () => {
    setIsLoading(true)
    try {
      const order = await orderService.getById(orderId)
      setOrder(order)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <CheckoutLoading />
    )
  }

  return (
  <div className="min-h-screen bg-muted/40">

    {/* ── Page header band — consistent with CoursesPage ── */}
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-3">

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Checkout
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Review your order before continuing to payment.
          </p>
        </div>
      </div>
    </div>

    {/* ── Main content ── */}
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_440px] lg:items-start">
        <CheckoutSummary order={order} />
        <PaymentSection
          orderId={order?.id}
          courseId={order?.course.id}
          actionLoading={actionLoading}
          totalAmount={formatCurrency(order?.totalAmount ?? 0)}
        />
      </div>
    </main>

  </div>

  );
}