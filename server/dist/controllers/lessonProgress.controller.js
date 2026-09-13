import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { LessonProgress } from "../models/lessonProgress.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Lesson } from "../models/lesson.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import redisClient from "../config/redis.js";
export const completeLesson = asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    if (!lessonId) {
        throw new ApiError(400, "lessonId is required");
    }
    const lesson = req.lessonContext;
    const userId = req.user._id;
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const progress = await LessonProgress.findOneAndUpdate({
                user: userId,
                course: lesson?.course,
            }).session(session);
            if (!progress) {
                throw new ApiError(404, "Lesson progress not found");
            }
            const alreadyCompleted = progress.completedLessonIds.some((id) => id.toString() === lessonId);
            if (alreadyCompleted) {
                return;
            }
            progress.completedLessonIds.push(lesson?.id);
            if (progress.completedLessons >= progress.totalLessons) {
                return;
            }
            progress.completedLessons = progress.completedLessonIds.length;
            progress.progress =
                progress.totalLessons === 0
                    ? 0
                    : Math.round((progress.completedLessons / progress.totalLessons) * 100);
            if (progress.completedLessons >= progress.totalLessons) {
                progress.completedLessons = progress.totalLessons;
                progress.progress = 100;
                progress.completeAt = new Date();
            }
            await progress.save({ session });
        });
        await redisClient.del(`lesson-progress:${userId}:course:${lesson?.course}`);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Lesson completed successfully"));
    }
    finally {
        await session.endSession();
    }
});
export const getLessonProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        throw new ApiError(400, "courseId is required");
    }
    const userId = req.user._id;
    const cacheKey = `lesson-progress:${userId}:course:${courseId}`;
    const cachedProgress = await redisClient.get(cacheKey);
    if (cachedProgress) {
        return res
            .status(200)
            .json(new ApiResponse(200, JSON.parse(cachedProgress), "Lesson progress fetched successfully"));
    }
    const progress = await LessonProgress.findOne({
        user: userId,
        course: courseId,
    })
        .select("_id progress completedLessons totalLessons completeAt createdAt updatedAt")
        .lean();
    if (!progress) {
        throw new ApiError(404, "Lesson progress not found");
    }
    const formattedProgress = {
        id: progress._id.toString(),
        progress: progress.progress,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        completeAt: progress.completeAt,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
    };
    await redisClient.setEx(cacheKey, 30, JSON.stringify(formattedProgress));
    return res
        .status(200)
        .json(new ApiResponse(200, formattedProgress || [], "Sucessfully get Lesson progress"));
});
//# sourceMappingURL=lessonProgress.controller.js.map