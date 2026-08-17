import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import slugify from "slugify";
import { Order } from "../models/order.model.js";
import { format } from "node:path";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";
const startDate = new Date();
startDate.setDate(startDate.getDate() - 6);
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);
export const getAdminMetrics = asyncHandler(async (req, res) => {
    const revenueAggregation = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                    },
                },
                revenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);
    const revenueMap = new Map(revenueAggregation.map((item) => [item._id, item.revenue]));
    const revenueData = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const key = date.toISOString().split("T")[0];
        revenueData.push({
            label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            revenue: revenueMap.get(key) ?? 0,
        });
    }
    const orderAggregation = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                    },
                },
                orders: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);
    const orderMap = new Map(orderAggregation.map((item) => [item._id, item.orders]));
    const orderData = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const key = date.toISOString().split("T")[0];
        orderData.push({
            label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            orders: orderMap.get(key) ?? 0,
        });
    }
    const enrollmentAggregation = await Enrollment.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                    },
                },
                enrollments: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);
    const enrollmentMap = new Map(enrollmentAggregation.map((item) => [item._id, item.enrollments]));
    const enrollmentData = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const key = date.toISOString().split("T")[0];
        enrollmentData.push({
            label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            enrollments: enrollmentMap.get(key) ?? 0,
        });
    }
    const [revenueResult, totalOrders, totalEnrollments, totalStudents,] = await Promise.all([
        Order.aggregate([
            {
                $match: {
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]),
        Order.countDocuments({
            isPaid: true,
        }),
        Enrollment.countDocuments(),
        User.countDocuments({
            role: "student",
        }),
    ]);
    const stats = {
        totalRevenue: revenueResult[0]?.total ?? 0,
        totalOrders,
        totalEnrollments,
        totalStudents,
    };
    return res.status(200).json(new ApiResponse(200, {
        revenueData,
        orderData,
        enrollmentData,
        stats
    }, "Successfully got all admin metrics"));
});
//# sourceMappingURL=admin.controller.js.map