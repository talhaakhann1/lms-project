import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";

function commonReviewAggregation(): PipelineStage[] {
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
              avatar: 1,
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
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              title: 1,
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
        comment: 1,
        user: 1,
        course: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        created: -1,
      },
    },
  ];
}

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { comment } = req.body;
    const { courseId } = req.params;
    if (!courseId) {
      throw new ApiError(400, "reviewId is required");
    }
    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(400, "review does not exist");
    }

    const userId = req.user._id;

    const existingReview = await Review.findOne({
      course: courseId,
      user: userId,
    });
    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this course");
    }
    const review = await Review.create({
      comment,
      course: course._id,
      user: userId,
    });
    const [createdReview] = await Review.aggregate([
      {
        $match: {
          _id: review._id,
        },
      },
      ...commonReviewAggregation(),
    ]);
    return res
      .status(201)
      .json(
        new ApiResponse(201, createdReview, "Successfully created the review"),
      );
  },
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { comment } = req.body;
    const { reviewId } = req.params;
    if (!reviewId) {
      throw new ApiError(400, "reviewId is required");
    }
    const userId = req.user._id;
    const review = await Review.findOneAndUpdate(
      {
        _id: reviewId,
        user: userId,
      },
      {
        $set: {
          comment: comment,
        },
      },
      { new: true },
    );
    if (!review) {
      throw new ApiError(404, "review does not exist");
    }
    const [updatedReview] = await Review.aggregate([
      {
        $match: {
          _id: review._id,
        },
      },
      ...commonReviewAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedReview, "Successfully updated the review"),
      );
  },
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    if (!reviewId) {
      throw new ApiError(400, "reviewId is required");
    }
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new ApiError(404, "review does not exist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully deleted the review"));
  },
);

export const getCourseReviewById = asyncHandler(
  async (req: Request, res: Response) => {
    const  courseId  = req.params.courseId as string;
    if (!courseId) {
      throw new ApiError(400, "Invalid course id");
    }
    const review = await Review.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      ...commonReviewAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          review || [],
          "Successfully get all review by courseId",
        ),
      );
  },
);
