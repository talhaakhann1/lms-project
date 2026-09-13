import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { Types } from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { LessonProgress } from "../models/lessonProgress.model.js";
import { title } from "process";
import redisClient from "../config/redis.js";
function commonLessonAggregation(userId) {
    return [
        {
            $set: {
                courseId: "$course",
            },
        },
        {
            $lookup: {
                from: "enrollments",
                let: {
                    courseId: "$courseId",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: userId
                                ? {
                                    $and: [
                                        {
                                            $eq: ["$course", "$$courseId"],
                                        },
                                        {
                                            $eq: ["$user", userId],
                                        },
                                    ],
                                }
                                : {
                                    $eq: [1, 0],
                                },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ],
                as: "enrollment",
            },
        },
        {
            $lookup: {
                from: "lessonprogresses",
                let: {
                    courseId: "$courseId",
                    lessonId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: userId
                                ? {
                                    $and: [
                                        {
                                            $eq: ["$course", "$$courseId"],
                                        },
                                        {
                                            $eq: ["$user", userId],
                                        },
                                    ],
                                }
                                : {
                                    $eq: [1, 0],
                                },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            completedLessonIds: 1,
                        },
                    },
                ],
                as: "lessonProgress",
            },
        },
        {
            $addFields: {
                isEnrolled: {
                    $gt: [
                        {
                            $size: "$enrollment",
                        },
                        0,
                    ],
                },
                isCompleted: {
                    $in: [
                        "$_id",
                        {
                            $ifNull: [
                                {
                                    $first: "$lessonProgress.completedLessonIds",
                                },
                                [],
                            ],
                        },
                    ],
                },
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            id: { $toString: "$_id" },
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                        },
                    },
                ],
            },
        },
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
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                enrollment: 0,
                lessonProgress: 0,
                courseId: 0,
            },
        },
        {
            $unwind: {
                path: "$course",
                preserveNullAndEmptyArrays: true,
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
                id: {
                    $toString: "$_id",
                },
                title: 1,
                description: 1,
                body: 1,
                order: 1,
                video: 1,
                course: 1,
                instructor: 1,
                isEnrolled: 1,
                isCompleted: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
        {
            $sort: {
                order: 1,
            },
        },
    ];
}
export const createLesson = asyncHandler(async (req, res) => {
    const { title, description, body, order, instructor, isPublished } = req.body;
    const { courseId } = req.params;
    if (!req.file) {
        throw new ApiError(404, "video file is required");
    }
    if (!courseId || Array.isArray(courseId)) {
        throw new ApiError(400, "Invalid course id");
    }
    const userId = req.user._id;
    const [courseExists, existingLesson] = await Promise.all([
        Course.exists({
            _id: courseId,
        }),
        Lesson.findOne({
            course: courseId,
            $or: [{ title }, { order }],
        }).lean(),
    ]);
    if (!courseExists) {
        throw new ApiError(404, "Course does not exist");
    }
    if (existingLesson) {
        throw new ApiError(409, "A lesson with this title or order already exists");
    }
    const videoLocalPath = req.file?.path;
    let uploadedVideoPublicId = null;
    if (!videoLocalPath) {
        throw new ApiError(400, "videolocalpath is required");
    }
    const video = await uploadAtCloudinary(videoLocalPath);
    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading at cloudinary");
    }
    uploadedVideoPublicId = video.public_id;
    const session = await mongoose.startSession();
    try {
        const lesson = await session.withTransaction(async () => {
            const lesson = new Lesson({
                title,
                description,
                body,
                order,
                instructor,
                video: {
                    url: video.secure_url,
                    publicId: video.public_id,
                    duration: video.duration,
                },
                course: courseId,
                isPublished,
                createdBy: userId,
            });
            await lesson.save({ session });
            await LessonProgress.updateMany({
                course: courseId,
            }, [
                {
                    $set: {
                        totalLessons: {
                            $add: ["$totalLessons", 1],
                        },
                    },
                },
                {
                    $set: {
                        progress: {
                            $cond: [
                                { $eq: ["$totalLessons", 0] },
                                0,
                                {
                                    $round: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: ["$completedLessons", "$totalLessons"],
                                                },
                                                100,
                                            ],
                                        },
                                        0,
                                    ],
                                },
                            ],
                        },
                    },
                },
            ], {
                session,
                updatePipeline: true,
            });
            return lesson;
        });
        if (!lesson) {
            throw new ApiError(500, "Failed to create lesson");
        }
        const lessonId = lesson._id.toString();
        await Promise.all([
            redisClient.del(`lesson:${lessonId}:course:${courseId}`),
            redisClient.del(`course:${courseId}:lessons`),
            redisClient.del(`lesson-progress:${userId}:course:${courseId}`),
        ]);
    }
    catch (error) {
        if (uploadedVideoPublicId) {
            try {
                await deleteAtCloudinary(uploadedVideoPublicId, "video");
            }
            catch (cleanupError) {
                console.error("Cloudinary cleanup failed:", cleanupError);
            }
        }
        throw error;
    }
    finally {
        await session.endSession();
    }
    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Successfully created the lesson"));
});
export const updateLesson = asyncHandler(async (req, res) => {
    const { title, description, body, order, instructor, isPublished } = req.body;
    const { lessonId } = req.params;
    if (!lessonId) {
        throw new ApiError(400, "lession id is required");
    }
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (body !== undefined)
        updateData.body = body;
    if (order !== undefined)
        updateData.order = order;
    if (instructor !== undefined)
        updateData.instructor = instructor;
    if (isPublished !== undefined)
        updateData.isPublished = isPublished;
    const existingLesson = await Lesson.findById(lessonId);
    if (!existingLesson) {
        throw new ApiError(404, "Lesson not found");
    }
    if (req.file) {
        const uploadedVideo = await uploadAtCloudinary(req.file.path);
        if (!uploadedVideo) {
            throw new ApiError(500, "Something went wrong while uploading the video.");
        }
        updateData.video = {
            url: uploadedVideo.secure_url,
            publicId: uploadedVideo.public_id,
            duration: uploadedVideo.duration,
        };
        if (existingLesson.video?.publicId) {
            await deleteAtCloudinary(existingLesson.video.publicId, "video");
        }
    }
    const lesson = await Lesson.findByIdAndUpdate(lessonId, {
        $set: updateData,
    }, { new: true });
    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }
    const courseId = lesson.course.toString();
    await Promise.all([
        redisClient.del(`lesson:${lessonId}:course:${courseId}`),
        redisClient.del(`course:${courseId}:lessons`),
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully updated the lesson"));
});
export const deleteLesson = asyncHandler(async (req, res) => {
    const lessonId = req.params.lessonId;
    if (!lessonId) {
        throw new ApiError(400, "lession id is required");
    }
    const userId = req.user._id;
    const session = await mongoose.startSession();
    let deletedLesson;
    try {
        const deletedData = await session.withTransaction(async () => {
            deletedLesson = await Lesson.findByIdAndDelete(lessonId, {
                session,
            });
            if (!deletedLesson) {
                throw new ApiError(404, "Lesson does not exist");
            }
            const courseId = deletedLesson.course.toString();
            await LessonProgress.updateMany({
                course: courseId,
            }, [
                {
                    $set: {
                        totalLessons: {
                            $max: [{ $subtract: ["$totalLessons", 1] }, 0],
                        },
                        completedLessonIds: {
                            $filter: {
                                input: "$completedLessonIds",
                                as: "completedLessonId",
                                cond: {
                                    $ne: [
                                        "$$completedLessonId",
                                        new mongoose.Types.ObjectId(lessonId),
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $set: {
                        completedLessons: {
                            $size: "$completedLessonIds",
                        },
                    },
                },
                {
                    $set: {
                        progress: {
                            $cond: [
                                { $eq: ["$totalLessons", 0] },
                                0,
                                {
                                    $round: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: ["$completedLessons", "$totalLessons"],
                                                },
                                                100,
                                            ],
                                        },
                                        0,
                                    ],
                                },
                            ],
                        },
                        completeAt: {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ["$totalLessons", 0] },
                                        { $eq: ["$completedLessons", "$totalLessons"] },
                                    ],
                                },
                                "$completeAt",
                                null,
                            ],
                        },
                    },
                },
            ], {
                session,
                updatePipeline: true,
            });
            return {
                videoPublicId: deletedLesson.video.publicId,
                courseId
            };
        });
        if (!deletedData) {
            throw new ApiError(500, "Failed to delete lesson");
        }
        const { courseId, videoPublicId } = deletedData;
        await deleteAtCloudinary(videoPublicId, "video");
        await Promise.all([
            redisClient.del(`lesson:${lessonId}:course:${courseId}`),
            redisClient.del(`course:${courseId}:lessons`),
            redisClient.del(`lesson-progress:${userId}:course:${courseId}`),
        ]);
    }
    catch (error) {
        throw new ApiError(500, "Failed to delete lesson");
    }
    finally {
        await session.endSession();
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Successfully deleted the lesson"));
});
export const getLessonById = asyncHandler(async (req, res) => {
    console.time("get-lesson-total");
    const { courseId, lessonId } = req.params;
    if (typeof courseId !== "string" ||
        !mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid course id");
    }
    if (typeof lessonId !== "string" ||
        !mongoose.Types.ObjectId.isValid(lessonId)) {
        throw new ApiError(400, "Invalid lesson id");
    }
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
    const cacheKey = `lesson:${lessonId}:course:${courseId}`;
    const cachedLesson = await redisClient.get(cacheKey);
    if (cachedLesson) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cachedLesson), "Lesson fetched successfully"));
    }
    const existedLesson = await Lesson.findOne({
        _id: lessonObjectId,
        course: courseObjectId,
    })
        .select("_id course order")
        .lean();
    console.timeEnd("find-current");
    if (!existedLesson) {
        throw new ApiError(404, "Lesson not found in this course");
    }
    console.time("parallel-queries");
    const [previousLesson, nextLesson, lessonResult] = await Promise.all([
        Lesson.findOne({
            course: courseObjectId,
            order: {
                $lt: existedLesson.order,
            },
        })
            .sort({
            order: -1,
        })
            .select("_id title")
            .lean(),
        Lesson.findOne({
            course: courseObjectId,
            order: {
                $gt: existedLesson.order,
            },
        })
            .sort({
            order: 1,
        })
            .select("_id title")
            .lean(),
        Lesson.aggregate([
            {
                $match: {
                    _id: lessonObjectId,
                    course: courseObjectId,
                },
            },
            ...commonLessonAggregation(req.user._id),
        ]),
    ]);
    const lesson = lessonResult[0];
    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }
    const navigation = {
        previousLesson: previousLesson
            ? {
                id: previousLesson._id.toString(),
                title: previousLesson.title,
            }
            : null,
        nextLesson: nextLesson
            ? {
                id: nextLesson._id.toString(),
                title: nextLesson.title,
            }
            : null,
    };
    await redisClient.setEx(cacheKey, 300, JSON.stringify({
        lesson,
        navigation,
    }));
    return res.status(200).json(new ApiResponse(200, {
        lesson,
        navigation,
    }, "Lesson fetched successfully"));
});
export const getAllCourseLessons = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const cacheKey = `course:${courseId}:lessons`;
    const cachedLessons = await redisClient.get(cacheKey);
    if (cachedLessons) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cachedLessons), "Successfully get all lessons"));
    }
    const lessons = await Lesson.aggregate([
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        ...commonLessonAggregation(req.user?._id),
    ]);
    await redisClient.setEx(cacheKey, 300, JSON.stringify(lessons));
    return res
        .status(200)
        .json(new ApiResponse(200, lessons || [], "Successfully get all lessons"));
});
//# sourceMappingURL=lesson.controller.js.map