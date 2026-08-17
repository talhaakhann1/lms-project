import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { OrderStatus } from "../types/order.enum.js";
import mongoose from "mongoose";
function commonOrderAggregation() {
    return [
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
                            email: 1
                        },
                    },
                ],
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
                        $lookup: {
                            from: "users",
                            localField: "instructor",
                            foreignField: "_id",
                            as: "instructor",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        id: { $toString: "$_id" },
                                        fullName: 1,
                                        email: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: "$instructor",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            id: { $toString: "$_id" },
                            title: 1,
                            instructor: 1,
                            thumbnail: 1
                        },
                    },
                ],
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                id: { $toString: "$_id" },
                course: 1,
                user: 1,
                totalAmount: 1,
                status: 1,
                isPaid: 1,
                checkoutSessionId: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
        { $sort: { createdAt: -1 } },
    ];
}
export const createOrder = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    console.log(courseId);
    const userId = req.user._id;
    if (!courseId) {
        throw new ApiError(400, "course id is required");
    }
    const existCourse = await Course.findById(courseId);
    if (!existCourse) {
        throw new ApiError(404, "course does not exist");
    }
    const existingOrder = await Order.findOne({
        user: userId,
        course: courseId,
        status: OrderStatus.PENDING,
    });
    if (existingOrder) {
        const [order] = await Order.aggregate([
            {
                $match: {
                    _id: existingOrder._id,
                },
            },
            ...commonOrderAggregation(),
        ]);
        return res
            .status(200)
            .json(new ApiResponse(200, order, "Existing pending order"));
    }
    const createdOrder = await Order.create({
        course: existCourse._id,
        user: userId,
        totalAmount: existCourse.price,
        status: OrderStatus.PENDING,
        isPaid: false,
    });
    if (!createdOrder) {
        throw new ApiError(400, "Something went wrong in creating order");
    }
    const [order] = await Order.aggregate([
        {
            $match: {
                _id: createdOrder._id,
            },
        },
        ...commonOrderAggregation(),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, order, "Successfully created order"));
});
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $match: {},
        },
        ...commonOrderAggregation(),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, orders || [], "Successfully get all orders"));
});
export const getOrderById = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    if (!orderId) {
        throw new ApiError(400, "orderid is required");
    }
    const [order] = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId),
            },
        },
        ...commonOrderAggregation(),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, order, "Successfully get order"));
});
//# sourceMappingURL=order.controller.js.map