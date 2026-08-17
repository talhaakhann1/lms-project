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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10 lg:px-8 lg:py-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Checkout
        </h1>
        <p className="text-base text-muted-foreground">
          Review your order before continuing to payment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <CheckoutSummary order={order} />
        <PaymentSection
          orderId={order?.id}
          courseId={order?.course.id}
          actionLoading={actionLoading}
          totalAmount={formatCurrency(order?.totalAmount ?? 0)}
        />
      </div>
    </main>

  );
}