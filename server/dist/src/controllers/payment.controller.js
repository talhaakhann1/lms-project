import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { Types } from "mongoose";
import { stripe } from "../utils/stripeInstance.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { Course } from "../models/course.model.js";
function commonPaymentAggregation() {
    return [
        {
            $lookup: {
                from: "orders",
                let: { orderId: "$orderId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$orderId"],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "course",
                            foreignField: "_id",
                            as: "course",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        id: { $toString: "$_id" },
                                        title: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            id: { $toString: "$_id" },
                            status: 1,
                            course: { $first: "$course" },
                        },
                    },
                ],
                as: "order",
            },
        },
        {
            $addFields: {
                order: { $first: "$order" },
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
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
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
// export const createPaymentIntent = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { orderId } = req.params;
//     if (!orderId) {
//       throw new ApiError(400, "order is required");
//     }
//     const order = await Order.findById(orderId);
//     if (!order) {
//       throw new ApiError(400, "Order does not exist");
//     }
//     if (order.isPaid) {
//       throw new ApiError(400, "Order is already paid");
//     }
//     const paymentIntent = await stripe.paymentIntents.create(
//       {
//         amount: order.totalAmount * 100,
//         currency: "usd",
//         automatic_payment_methods: {
//           enabled: true,
//           allow_redirects: "never",
//         },
//         metadata: {
//           orderId: order._id.toString(),
//           userId: req.user._id.toString(),
//         },
//       },
//       {
//         idempotencyKey: crypto.randomUUID(),
//       },
//     );
//     order.paymentIntentId = paymentIntent.id;
//     await order.save();
//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         {
//           clientSecret: paymentIntent.client_secret,
//         },
//         "Payment intent created successfully",
//       ),
//     );
//   },
// );
export const createPaymentSession = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        throw new ApiError(400, "Order id is required");
    }
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    if (order.isPaid) {
        throw new ApiError(400, "Order is already paid");
    }
    const course = await Course.findById(order.course);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title,
                        description: course.description,
                    },
                    unit_amount: Math.round(order.totalAmount * 100),
                },
                quantity: 1,
            },
        ],
        payment_intent_data: {
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString(),
                courseId: course._id.toString(),
            },
        },
        success_url: `${process.env.CLIENT_URL}/payment/success?orderId=${order._id}&courseId=${course._id}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout/${order._id}`,
    });
    order.checkoutSessionId = session.id;
    await order.save();
    return res.status(200).json(new ApiResponse(200, {
        url: session.url,
    }, "Checkout session created successfully"));
});
export const getPaymentByOrderId = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order id");
    }
    const [payment] = await Payment.aggregate([
        {
            $match: {
                orderId: new mongoose.Types.ObjectId(orderId),
            },
        },
        ...commonPaymentAggregation(),
    ]);
    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});
export const getAllPayment = asyncHandler(async (req, res) => {
    const [payment] = await Payment.aggregate([
        {
            $match: {},
        },
        ...commonPaymentAggregation(),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, payment || [], "Successfully get all payment"));
});
//# sourceMappingURL=payment.controller.js.map