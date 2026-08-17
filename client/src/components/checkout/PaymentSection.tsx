"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { paymentService } from "@/src/services/payment.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError } from "../ui/toaster";

export interface PaymentSectionProps {
  actionLoading?:boolean
  orderId?: string|null;
  courseId?:string|null;
  totalAmount: string;
}

export function PaymentSection({ orderId,totalAmount }: PaymentSectionProps) {

const [loading, setLoading] = useState(false);

 const handleClick = async () => {
    try {
      setLoading(true);

      const res = await paymentService.createPaymentSession(orderId as string);

      window.location.href = res;
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse<unknown>>;
              const errorMessage =
                axiosError.response?.data.message ?? "Something went wrong";
        
              console.error(errorMessage);
        
              showError("Something went wrong", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-base font-semibold text-foreground">
            Payment
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your payment is securely processed by Stripe.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                className="h-4 w-4 text-primary"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground">
                Secure checkout
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-xs text-muted-foreground">SSL encrypted</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-1">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span
              className="font-display text-base font-bold tracking-tight text-foreground"
              aria-label="Stripe"
            >
              stripe
            </span>
          </div>

          <Separator className="bg-border" />


          {/* Stripe test mode information */}
          <p className="text-center text-xs text-muted-foreground">
            Demo payment: Use Stripe test card{" "}
            <span className="font-medium text-foreground">
              4242 4242 4242 4242
            </span>
            {" "}with any future expiry date and any 3-digit CVC.
          </p>
    
         
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
            onClick={handleClick}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Redirecting..." : `Pay ${totalAmount}`}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
            </motion.div>

             <p className="text-center text-xs text-muted-foreground">
            You will be redirected to Stripe's secure checkout page.
          </p>
        
        </CardContent>
      </Card>
    </motion.div>
  );
}