import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { Types, type PipelineStage } from "mongoose";
import { stripe } from "../utils/stripeInstance.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import crypto from "crypto";

function commonPaymentAggregation(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              status: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$order" },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        amount: 1,
        status: 1,
        transactionId: 1,
        paymentMethod: 1,
        paidAt: 1,
        order: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];
}

export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (!orderId) {
      throw new ApiError(400, "order is required");
    }
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(400, "Order does not exist");
    }
    if (order.isPaid) {
      throw new ApiError(400, "Order is already paid");
    }
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: order.totalAmount * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
      },
      {
        idempotencyKey: crypto.randomUUID(),
      },
    );
    await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: "pm_card_visa",
    });
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          clientSecret: paymentIntent.client_secret,
        },
        "Payment intent created successfully",
      ),
    );
  },
);

//admin only

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    if (!paymentId) {
      throw new ApiError(400, "paymentId is required");
    }
    const [payment] = await Payment.aggregate([
      {
        $match: {
          _id: paymentId,
        },
      },
      ...commonPaymentAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, payment || [], "Successfully get payment by id"),
      );
  },
);
export const getAllPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const [payment] = await Payment.aggregate([
      {
        $match: {},
      },
      ...commonPaymentAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, payment || [], "Successfully get all payment"),
      );
  },
);
