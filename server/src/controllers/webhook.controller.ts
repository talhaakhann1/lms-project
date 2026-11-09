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

        console.log("checkout session metadata:", checkoutSession.metadata);
        console.log("payment_intent:", checkoutSession.payment_intent);

        if (!checkoutSession.payment_intent) {
          return res.sendStatus(200);
        }

        const paymentIntentId =
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : (checkoutSession.payment_intent as { id: string }).id;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const { orderId, userId } = checkoutSession.metadata as {
          orderId: string;
          userId: string;
        };

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
                _id: new mongoose.Types.ObjectId(orderId),
                user: new mongoose.Types.ObjectId(userId),
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

            if (paymentIntent.amount !== Math.round(order.totalAmount * 100)) {
              throw new ApiError(400, "Payment amount mismatch");
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
        } catch (error: unknown) {
          console.log("webhook", error);
          return res.status(500).send("Webhook handler failed");
        } finally {
          await session.endSession();
        }
      }

      case "checkout.session.expired": {
        const checkoutSession = event.data.object;
        const { orderId } = (checkoutSession.metadata || {}) as {
          orderId?: string;
        };

        if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
          await Order.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(orderId), isPaid: false },
            { $set: { status: OrderStatus.FAILED } }
          );
        }

        return res.sendStatus(200);
      }

      default:
        return res.sendStatus(200);
    }
  },
);

