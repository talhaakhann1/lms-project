"use client"
import { PaymentSuccessCard } from "../../../../components/payment/PaymentSuccessCard";
import { PaymentSuccessDetails } from "../../../../components/payment/PaymentSuccesDetails";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Payment } from "@/src/types/interfaces/payment.interface";
import { paymentService } from "@/src/services/payment.service";
import { showError } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";

export default function PaymentSuccessPage() {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const courseId = searchParams.get("courseId");
  const fetchPayment = useCallback(async () => {
    setIsLoading(true)
    try {
      const payment = await paymentService.getByOrderId(orderId as string)
      setPayment(payment)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayment()
  }, [orderId])
  

  return (
    <main
      className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-6 px-6 py-8 lg:px-8"
      aria-labelledby="payment-success-heading"
    >
      <h1 id="payment-success-heading" className="sr-only">
        Payment Successful
      </h1>

      <PaymentSuccessCard
        courseName={payment?.order.course.title}
        courseHref={`/dashboard/courses/${courseId}`}
        dashboardHref="/dashboard/courses"
      />

      <PaymentSuccessDetails payment={payment} />
    </main>
  );
}