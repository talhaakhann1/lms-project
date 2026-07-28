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

    const lesson = await Lesson.findById(lessonId).select("course");

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

        const existingProgress = await LessonProgress.findOne({
          user: userId,
          lesson: lessonId,
        }).session(session);

        if (existingProgress?.completed) {
          return;
        }

        await LessonProgress.findOneAndUpdate(
          {
            user: userId,
            lesson: lessonId,
          },
          {
            $set: {
              course: lesson.course,
              completed: true,
              completedAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            session,
          }
        );

        enrollment.completedLessons += 1;

        enrollment.progress = Math.round(
          (enrollment.completedLessons / enrollment.totalLessons) * 100
        );

        if (enrollment.completedLessons === enrollment.totalLessons) {
          enrollment.completedAt = new Date();
        }

        await enrollment.save({ session });
      });

      return res.status(200).json(
        new ApiResponse(200, {}, "Lesson completed successfully")
      );
    } finally {
      await session.endSession();
    }
  }
);