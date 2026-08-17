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
      case "checkout.session.completed": {

        const checkoutSession = event.data.object;

        const paymentIntent = await stripe.paymentIntents.retrieve(
          checkoutSession.payment_intent as string,
        );

        const { orderId, userId } = paymentIntent.metadata;

        console.log(paymentIntent.metadata);

        if (!orderId || !userId) {
          throw new ApiError(400, "Missing metadata");
        }

        const session = await mongoose.startSession();

        try {
          await session.withTransaction(async () => {
            
            const existingPayment = await Payment.findOne({
              transactionId: paymentIntent.id,
            }).session(session);

            if (existingPayment) {
              return;
            }

            const order = await Order.findOneAndUpdate(
              {
                _id: orderId,
                user: userId,
              },
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

            if (paymentIntent.amount !== order.totalAmount * 100) {
              throw new ApiError(400, "Payment amount mismatch");
            }

            const existing = await Payment.findOne({
              transactionId: paymentIntent.id,
            });

            if (existing) {
              return res.sendStatus(200);
            }

            await Payment.create(
              [
                {
                  orderId: order._id,
                  user: userId,
                  amount: paymentIntent.amount / 100,
                  transactionId: paymentIntent.id,
                  status: PaymentStatus.SUCCESS,
                  paidAt: new Date(),
                },
              ],
              { session },
            );

            const alreadyEnrolled = await Enrollment.findOne({
              user: userId,
              course: order.course,
            }).session(session);

            if (!alreadyEnrolled) {
              const totalLessons = await Lesson.countDocuments({
                course: order.course,
              }).session(session);
              await Enrollment.create(
                [
                  {
                    user: userId,
                    course: order.course,
                    enrolledAt: new Date(),
                  },
                ],
                { session },
              );
              await LessonProgress.create(
                [
                  {
                    user: userId,
                    course: order.course,
                    totalLessons,
                    completedLessons: 0,
                    progress: 0,
                    enrolledAt: new Date(),
                  },
                ],
                { session },
              );
            }
          });

          return res.sendStatus(200);
          
        } catch(error:unknown){
          console.log("webhook",error);
      
        }
        finally {
          await session.endSession();
        }
      }



      default:
        return res.sendStatus(200);
    }
  },
);
