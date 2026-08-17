import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, {} from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { Types } from "mongoose";
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
    const userId = req.user._id;
    if (!req.file) {
        throw new ApiError(404, "thumbnail file is required");
    }
    const thumbnailLocalPath = req.file.path;
    const existedCourse = await Course.findOne({
        title,
        createdBy: userId,
    });
    if (existedCourse) {
        throw new ApiError(400, "Course with this title already exist");
    }
    const thumbnail = await uploadAtCloudinary(thumbnailLocalPath);
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
    const [createdCourse] = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(course._id),
            },
        },
        ...commonCourseAggregation(),
    ]);
    return res
        .status(201)
        .json(new ApiResponse(201, createdCourse, "Successfully created the course"));
});
export const updateCourse = asyncHandler(async (req, res) => {
    const { title, description, tagline, instructor, category, level, price, learningOutcomes, requirements, isPublished, } = req.body;
    console.log("REs", req.body);
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
    const { courseId } = req.params;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const existedCourse = await Course.findById(courseId);
    if (!existedCourse) {
        throw new ApiError(404, "course does not exist");
    }
    if (req.file) {
        console.log("file", req.file);
        const thumbnailLocalPath = req.file.path;
        const uploadedThumbnail = await uploadAtCloudinary(thumbnailLocalPath);
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
        throw new ApiError(400, "Something went wrong while updating course");
    }
    const [updatedCourse] = await Course.aggregate([
        {
            $match: {
                _id: course._id,
                isPublished: true,
            },
        },
        ...commonCourseAggregation(req.user._id),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, updatedCourse, "Successfully updated the course"));
});
export const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const existedCourse = await Course.findOne({
        _id: courseId,
        createdBy: userId,
    });
    if (!existedCourse) {
        throw new ApiError(404, "course does not exist or access denied");
    }
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            await Course.deleteOne({
                _id: courseId,
            }).session(session);
            await Lesson.deleteMany({
                courseId: courseId,
            }).session(session);
        });
        console.log("Delete Course Transaction committed successfully.");
    }
    catch (error) {
        console.error("Delete Course Transaction aborted due to error:", error);
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
    const existedCourse = await Course.findById(courseId);
    if (!existedCourse) {
        throw new ApiError(404, "course does not exist");
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
    return res
        .status(200)
        .json(new ApiResponse(200, course || [], "Successfully get course by id"));
});
export const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.aggregate([
        {
            $match: {
                isPublished: true,
            },
        },
        ...commonCourseAggregation(req.user?._id),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, courses || [], "Successfully get all published course"));
});
export const updateCourseThumbnail = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        throw new ApiError(400, "course id is required");
    }
    if (!req.file) {
        throw new ApiError(400, "thumbnail file is missing");
    }
    const existedCourse = await Course.findById(courseId);
    if (!existedCourse) {
        throw new ApiError(404, "course does not exist");
    }
    const thumbnailLocalPath = req.file.path;
    const thumbnail = await uploadAtCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(500, "Somethng went wrong while uploading at cloudinary");
    }
    const userId = req.user._id;
    const updatedCourse = await Course.findOneAndUpdate({
        _id: courseId,
        createdBy: userId,
    }, {
        $set: {
            thumbnail: {
                url: thumbnail.secure_url,
                publicId: thumbnail.public_id,
            },
        },
    }, { new: true });
    if (!updatedCourse) {
        throw new ApiError(400, "Something went wrong while updating course thumbnail");
    }
    const deleteThumbnail = await deleteAtCloudinary(existedCourse.thumbnail?.publicId, "image");
    if (!deleteThumbnail) {
        throw new ApiError(500, "Somethng went wrong while deleting at cloudinary");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully updated course thumbnail"));
});
//# sourceMappingURL=course.controller.js.map