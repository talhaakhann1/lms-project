import { z } from "zod";
import { PaymentMethods } from "../types/payment.enum.js";
export declare const createPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    transactionId: z.ZodString;
    paymentMethod: z.ZodEnum<typeof PaymentMethods>;
    paidAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=payment.schema.d.ts.map