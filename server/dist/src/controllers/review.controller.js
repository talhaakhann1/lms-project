import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import redisClient from "../config/redis.js";
function commonReviewAggregation() {
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
export const createReview = asyncHandler(async (req, res) => {
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
    await redisClient.del(`review:course:${courseId}`);
    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Successfully created the review"));
});
export const updateReview = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { reviewId } = req.params;
    if (!reviewId) {
        throw new ApiError(400, "reviewId is required");
    }
    const userId = req.user._id;
    const review = await Review.findOneAndUpdate({
        _id: reviewId,
        user: userId,
    }, {
        $set: {
            comment: comment,
        },
    }, { new: true });
    if (!review) {
        throw new ApiError(404, "review does not exist");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully updated the review"));
});
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        throw new ApiError(400, "reviewId is required");
    }
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        throw new ApiError(404, "review does not exist");
    }
    await redisClient.del(`review:course:${review?.course}`);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully deleted the review"));
});
export const getCourseReviewById = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    if (!courseId) {
        throw new ApiError(400, "Invalid course id");
    }
    const cacheKey = `review:course:${courseId}`;
    const cacheReview = await redisClient.get(cacheKey);
    if (cacheReview) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse, "Successfully get all review by courseId"));
    }
    const review = await Review.aggregate([
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        ...commonReviewAggregation(),
    ]);
    await redisClient.setEx(cacheKey, 60, JSON.stringify(review));
    return res
        .status(200)
        .json(new ApiResponse(200, review || [], "Successfully get all review by courseId"));
});
//# sourceMappingURL=review.controller.js.map