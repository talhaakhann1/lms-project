import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { OrderStatus } from "../types/order.enum.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user._id;
  if (!courseId) {
    throw new ApiError(400, "course id is required");
  }
  const existCourse = await Course.findById(courseId);
  if (!existCourse) {
    throw new ApiError(404, "course does not exist");
  }
  const order = await Order.findOne({
    course: courseId,
    user: userId,
  });
  if (order) {
    throw new ApiError(400, "Order already exists");
  }

  const createdOrder = await Order.create({
    course: existCourse._id,
    user: userId,
    totalAmount: existCourse.price,
    status: OrderStatus.PENDING,
    isPaid:false
  });
  if (!createdOrder) {
    throw new ApiError(400, "Something went wrong in creating order");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdOrder, "Successfully created order"));
});
