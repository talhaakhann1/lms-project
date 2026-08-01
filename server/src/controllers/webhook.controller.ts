import type { Request, Response } from "express";
import mongoose from "mongoose";
import { stripe } from "../utils/stripeInstance.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { OrderStatus } from "../types/order.enum.js";
import { PaymentStatus } from "../types/payment.enum.js";
import { LessonProgress } from "../models/lessonProgress.model.js";
import { Lesson } from "../models/lesson.model.js";

export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("reached");
    
    const signature = req.headers["stripe-signature"];

    if (!signature || Array.isArray(signature)) {
      throw new ApiError(400, "Stripe signature is missing");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const { orderId, userId } = paymentIntent.metadata;

        if (!orderId || !userId) {
          throw new ApiError(400, "Missing metadata");
        }

        const session = await mongoose.startSession();

        try {
          await session.withTransaction(async () => {
            // Prevent duplicate webhook processing
            const existingPayment = await Payment.findOne({
              transactionId: paymentIntent.id,
            }).session(session);

            if (existingPayment) {
              return;
            }

            const order = await Order.findByIdAndUpdate(
              orderId,
              {
                $set: {
                  isPaid: true,
                  status: OrderStatus.PAID,
                },
              },
              {
                new: true,
                session,
              },
            );

            if (!order) {
              throw new ApiError(404, "Order not found");
            }

            await Payment.create(
              [
                {
                  orderId: order._id,
                  user: userId,
                  amount: paymentIntent.amount / 100,
                  transactionId: paymentIntent.id,
                  status: PaymentStatus.SUCCESS,
                },
              ],
              { session },
            );

            const alreadyEnrolled = await Enrollment.findOne({
              user: userId,
              course: order.course,
            }).session(session);

            
            if (!alreadyEnrolled) {
              const totalLessons=await Lesson.countDocuments({
                course:order.course
              }).session(session)
              await Enrollment.create(
                [
                  {
                    user: userId,
                    course: order.course,
                    totalLessons,
                    completedLessons:0,
                    progress:0,
                    enrolledAt: new Date(),
                  },
                ],
                { session },
              );
            }
          });

          return res.sendStatus(200);
        } finally {
          await session.endSession();
        }
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const { orderId, userId } = paymentIntent.metadata;

        if (!orderId || !userId) {
          throw new ApiError(400, "Missing metadata");
        }

        await Order.findByIdAndUpdate(orderId, {
          status: OrderStatus.FAILED,
        });

        await Payment.create({
          orderId,
          user: userId,
          amount: paymentIntent.amount / 100,
          transactionId: paymentIntent.id,
          status: PaymentStatus.FAILED,
        });

        return res.sendStatus(200);
      }

      default:
        return res.sendStatus(200);
    }
  },
);
