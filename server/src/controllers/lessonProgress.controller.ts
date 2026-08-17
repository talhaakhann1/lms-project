import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { LessonProgress } from "../models/lessonProgress.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Lesson } from "../models/lesson.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const completeLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;

    if (!lessonId) {
      throw new ApiError(400, "lessonId is required");
    }

    const userId = req.user._id;

    const lesson = await Lesson.findById(lessonId).select("course").lean();

    if (!lesson) {
      throw new ApiError(404, "Lesson not found");
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
    
        const enrollment = await Enrollment.findOne({
          user: userId,
          course: lesson.course,
        }).session(session);

        if (!enrollment) {
          throw new ApiError(403, "You are not enrolled in this course");
        }

        const progress = await LessonProgress.findOneAndUpdate({
          user: userId,
          course: lesson.course,
        }).session(session);

        if (!progress) {
          throw new ApiError(404, "Lesson progress not found");
        }

        const alreadyCompleted =
          progress.completedLessonIds.some(
            (id) => id.toString() === lessonId,
          );

        if (alreadyCompleted) {
          return;
        }

        progress.completedLessonIds.push(lesson._id)


        // 3. Prevent completing beyond total lessons
        if (progress.completedLessons >= progress.totalLessons) {
          return;
        }

        // 4. Increment completed lessons
         progress.completedLessons =
          progress.completedLessonIds.length;

        // 5. Calculate progress
        progress.progress =
          progress.totalLessons === 0
            ? 0
            : Math.round(
                (progress.completedLessons / progress.totalLessons) * 100,
              );

        // 6. Course completed
        if (progress.completedLessons >= progress.totalLessons) {
          progress.completedLessons = progress.totalLessons;

          progress.progress = 100;
          progress.completeAt = new Date();
        }

        await progress.save({ session });
      });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Lesson completed successfully"));
    } finally {
      await session.endSession();
    }
  },
);

export const getLessonProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    if (!lessonId) {
      throw new ApiError(400, "lessonId is required");
    }
    const userId = req.user._id;

    const lesson = await Lesson.findById(lessonId).select("course").lean();

    if (!lesson) {
      throw new ApiError(404, "Lesson not found");
    }
    const existedProgress = await LessonProgress.findOne({
      user: userId,
      course: lesson.course,
    });

    if (!existedProgress) {
      throw new ApiError(404, "Lesson progress not found");
    }
    const [progress] = await LessonProgress.aggregate([
      {
        $match: {
          user: userId,
          course: lesson.course,
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          progress: 1,
          completedLessons: 1,
          totalLessons: 1,
          completeAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if(!progress){
      throw new ApiError(400,"Something went wrong in getting lesson progress")
    }
     return res
        .status(200)
        .json(new ApiResponse(200, progress, "Sucessfully get Lesson progress"));
  },
);
