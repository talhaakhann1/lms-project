import { z } from "zod";
import { PaymentMethods, PaymentStatus } from "../types/payment.enum.js";
export const createPaymentSchema = z.object({
    amount: z
        .number({ error: "Amount is required" })
        .positive("Amount must be greater than zero"),
    transactionId: z
        .string({ error: "Transaction ID is required" })
        .trim()
        .min(1, "Transaction ID cannot be empty"),
    paymentMethod: z.enum(PaymentMethods),
    paidAt: z.date(),
});
//# sourceMappingURL=payment.schema.js.map