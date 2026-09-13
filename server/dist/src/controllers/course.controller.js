import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, {} from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { Types } from "mongoose";
import redisClient from "../config/redis.js";
export function commonCourseAggregation(userId) {
    const matchExpr = userId
        ? {
            $and: [{ $eq: ["$course", "$$courseId"] }, { $eq: ["$user", userId] }],
        }
        : {
            $eq: [1, 0],
        };
    return [
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
                            title: 1,
                            bio: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "enrollments",
                let: {
                    courseId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: matchExpr,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            progress: 1,
                            completedLessons: 1,
                            totalLessons: 1,
                        },
                    },
                ],
                as: "enrollment",
            },
        },
        {
            $addFields: {
                isEnrolled: {
                    $gt: [{ $size: "$enrollment" }, 0],
                },
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
                description: 1,
                thumbnail: 1,
                tagline: 1,
                level: 1,
                price: 1,
                learningOutcomes: 1,
                requirements: 1,
                instructor: 1,
                category: 1,
                isEnrolled: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];
}
export const createCourse = asyncHandler(async (req, res) => {
    const { title, description, tagline, price, learningOutcomes, requirements, level, instructor, isPublished, category, } = req.body;
    if (!req.file) {
        throw new ApiError(404, "thumbnail file is required");
    }
    const userId = req.user._id;
    const existedCourse = await Course.findOne({
        title,
        createdBy: userId,
    });
    if (existedCourse) {
        throw new ApiError(400, "Course with this title already exist");
    }
    const thumbnailLocalPath = req.file.path;
    const thumbnail = await uploadAtCloudinary(thumbnailLocalPath, {
        type: "thumbnail",
    });
    if (!thumbnail) {
        throw new ApiError(500, "Somethng went wrong while uploading at cloudinary");
    }
    const course = await Course.create({
        title,
        description,
        tagline,
        price,
        thumbnail: {
            url: thumbnail.secure_url,
        },
        level,
        learningOutcomes,
        requirements,
        instructor,
        isPublished,
        category,
        createdBy: userId,
    });
    await redisClient.del(`courses:${userId}`);
    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Successfully created the course"));
});
export const updateCourse = asyncHandler(async (req, res) => {
    const { title, description, tagline, instructor, category, level, price, learningOutcomes, requirements, isPublished, } = req.body;
    const { courseId } = req.params;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const userId = req.user._id;
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (tagline !== undefined)
        updateData.tagline = tagline;
    if (instructor !== undefined)
        updateData.instructor = instructor;
    if (category !== undefined)
        updateData.category = category;
    if (level !== undefined)
        updateData.level = level;
    if (price !== undefined)
        updateData.price = price;
    if (learningOutcomes !== undefined)
        updateData.learningOutcomes = learningOutcomes;
    if (requirements !== undefined)
        updateData.requirements = requirements;
    if (isPublished !== undefined)
        updateData.isPublished = isPublished;
    const existedCourse = await Course.findById(courseId);
    if (!existedCourse) {
        throw new ApiError(404, "course does not exist");
    }
    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        const uploadedThumbnail = await uploadAtCloudinary(thumbnailLocalPath, {
            type: "thumbnail",
        });
        if (!uploadedThumbnail) {
            throw new ApiError(500, "Something went wrong while uploading the thumbnail.");
        }
        if (existedCourse.thumbnail?.publicId) {
            await deleteAtCloudinary(existedCourse.thumbnail.publicId, "image");
        }
        updateData.thumbnail = {
            url: uploadedThumbnail.secure_url,
            publicId: uploadedThumbnail.public_id,
        };
    }
    const course = await Course.findByIdAndUpdate(courseId, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!course) {
        throw new ApiError(404, "Lesson not found");
    }
    await Promise.all([
        redisClient.del(`courses:${userId}`),
        redisClient.del(`course:${courseId}`),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully updated the course"));
});
export const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const session = await mongoose.startSession();
    let deletedCourse;
    try {
        const deletedData = await session.withTransaction(async () => {
            deletedCourse = await Course.findOneAndDelete({
                _id: courseId,
                createdBy: userId,
            }).session(session);
            await Lesson.deleteMany({
                courseId: courseId,
            }).session(session);
            return {
                thumbnailPublicId: deletedCourse?.thumbnail.publicId,
            };
        });
        const thumbnailPublicId = deletedData.thumbnailPublicId;
        if (thumbnailPublicId) {
            await deleteAtCloudinary(thumbnailPublicId, "image");
        }
        await Promise.all([
            redisClient.del(`courses:${userId}`),
            redisClient.del(`course:${courseId}`),
            redisClient.del(`lessons:course:${courseId}`),
        ]);
    }
    catch (error) {
        throw new ApiError(500, "Failed to delete course");
    }
    finally {
        await session.endSession();
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully deleted the course"));
});
export const getCourseById = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const cacheKey = `course:${courseId}`;
    const cacheCourses = await redisClient.get(cacheKey);
    if (cacheCourses) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cacheCourses), "Successfully get course by id by redis"));
    }
    const [course] = await Course.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(courseId),
                isPublished: true,
            },
        },
        ...commonCourseAggregation(req.user?._id),
    ]);
    if (!course) {
        throw new ApiError(404, "course does not exist");
    }
    await redisClient.setEx(cacheKey, 60, JSON.stringify(course));
    return res
        .status(200)
        .json(new ApiResponse(200, course || [], "Successfully get course by id"));
});
export const getAllCourses = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const cacheKey = `courses:${userId}`;
    const cacheCourses = await redisClient.get(cacheKey);
    if (cacheCourses) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cacheCourses), "Successfully get all published course"));
    }
    const courses = await Course.aggregate([
        {
            $match: {
                isPublished: true,
            },
        },
        ...commonCourseAggregation(req.user?._id),
    ]);
    await redisClient.setEx(cacheKey, 60, JSON.stringify(courses));
    return res
        .status(200)
        .json(new ApiResponse(200, courses || [], "Successfully get all published course"));
});
//# sourceMappingURL=course.controller.js.map