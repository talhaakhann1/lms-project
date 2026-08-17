import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { Types, type PipelineStage } from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { useId } from "react";
import { Enrollment } from "../models/enrollment.model.js";
import { LessonProgress } from "../models/lessonProgress.model.js";
import { title } from "process";

function commonLessonAggregation(
  userId?: Types.ObjectId,
): PipelineStage[] {
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
export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, body, order, instructor, isPublished } =
      req.body;
    const { courseId } = req.params;
    if (!req.file) {
      throw new ApiError(404, "video file is required");
    }

    if (!courseId || Array.isArray(courseId)) {
      throw new ApiError(400, "Invalid course id");
    }
    const userId = req.user._id;
    const existedCourse = await Course.findById(courseId);
    if (!existedCourse) {
      throw new ApiError(404, "course does not exist");
    }
    const existLesson = await Lesson.findOne({
      title,
      order,
    });
    if (existLesson) {
      throw new ApiError(400, "lesson with this title or order already exist");
    }
    const videoLocalPath = req.file?.path;
    if (!videoLocalPath) {
      throw new ApiError(400, "videolocalpath is required");
    }
    const video = await uploadAtCloudinary(videoLocalPath);

    if (!video) {
      throw new ApiError(
        500,
        "Something went wrong while uploading at cloudinary",
      );
    }
    const lession = await Lesson.create({
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
    const progressRecords = await LessonProgress.find({
      course: courseId,
    });

    for (const progress of progressRecords) {
      progress.totalLessons += 1;

      progress.progress =
        progress.totalLessons === 0
          ? 0
          : Math.round(
              (progress.completedLessons / progress.totalLessons) * 100,
            );

      await progress.save();
    }

    const [createdLesson] = await Lesson.aggregate([
      {
        $match: {
          _id: lession._id,
        },
      },
      ...commonLessonAggregation(),
    ]);
    return res
      .status(201)
      .json(
        new ApiResponse(201, createdLesson, "Successfully created the lession"),
      );
  },
);

export const updateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, body, order, instructor, isPublished } =
      req.body;
    const { lessonId } = req.params;
    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (body !== undefined) updateData.body = body;
    if (order !== undefined) updateData.order = order;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const existedLesson = await Lesson.findById(lessonId);

    if (!existedLesson) {
      throw new ApiError(404, "lesson does not exist");
    }

    if (req.file) {
      const videoLocalPath = req.file.path;

      const uploadedVideo = await uploadAtCloudinary(videoLocalPath);

      if (!uploadedVideo) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the video.",
        );
      }

      if (existedLesson.video?.publicId) {
        await deleteAtCloudinary(existedLesson.video.publicId, "video");
      }

      updateData.video = {
        url: uploadedVideo.secure_url,
        publicId: uploadedVideo.public_id,
        duration: uploadedVideo.duration,
      };
    }

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: updateData,
      },
      { new: true },
    );
    if (!lesson) {
      throw new ApiError(400, "Something went wrong while updating the lesson");
    }

    const [updatedLesson] = await Lesson.aggregate([
      {
        $match: {
          _id: lesson._id,
        },
      },
      ...commonLessonAggregation(),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedLesson, "Successfully updated the lesson"),
      );
  },
);

export const deleteLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lessonId = req.params.lessonId as string;
    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }

    const lesson = await Lesson.findOne({
      _id: new mongoose.Types.ObjectId(lessonId),
    });
    if (!lesson) {
      throw new ApiError(400, "lesson does not exist");
    }

    const deleteLesson = await Lesson.findByIdAndDelete(lessonId);
    if (!deleteLesson) {
      throw new ApiError(400, "Something went wrong while deleting lesson");
    }
    const deleteVideo = await deleteAtCloudinary(
      lesson?.video.publicId,
      "video",
    );
    console.log(deleteVideo);

    if (!deleteVideo) {
      throw new ApiError(
        500,
        "Somethng went wrong while deleting at cloudinary",
      );
    }
    const progressRecords = await LessonProgress.find({
      course: deleteLesson.course,
    });

    for (const progress of progressRecords) {
      progress.totalLessons = Math.max(0, progress.totalLessons - 1);

      progress.progress =
        progress.totalLessons === 0
          ? 0
          : Math.round(
              (progress.completedLessons / progress.totalLessons) * 100,
            );

      if (progress.totalLessons === 0) {
        progress.progress = 0;
        progress.completedLessons = 0;
        progress.completeAt = null;
      }

      await progress.save();
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully deleted the lesson"));
  },
);

export const getLessonById = asyncHandler(
  async (req: Request, res: Response) => {
    const lessonId = req.params.lessonId as string;

    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }

    const existedlesson = await Lesson.findById(lessonId);

    if (!existedlesson) {
      throw new ApiError(400, "lession not found");
    }

    const previousLesson = await Lesson.findOne({
      course: existedlesson.course,
      order: { $lt: existedlesson.order },
    })

      .sort({ order: -1 })
      .select("_id title")
      .lean();

    const nextLesson = await Lesson.findOne({
      course: existedlesson.course,
      order: { $gt: existedlesson.order },
    })
      .sort({ order: 1 })
      .select("_id title")
      .lean();

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

    const [lesson] = await Lesson.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(lessonId),
        },
      },
      ...commonLessonAggregation(req.user._id),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          lesson,
          navigation,
        },
        "Successfully get lesson by id",
      ),
    );
  },
);

export const getAllCourseLessons = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (!courseId) {
      throw new ApiError(400, "courseId is required");
    }

    const lessons = await Lesson.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      ...commonLessonAggregation(req.user?._id),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, lessons || [], "Successfully get all lessons"),
      );
  },
);

export const updateLessonVideo = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    if (!lessonId) {
      throw new ApiError(400, "course id is required");
    }
    if (!req.file) {
      throw new ApiError(400, "Video file is missing");
    }
    const existedLesson = await Lesson.findById(lessonId);
    if (!existedLesson) {
      throw new ApiError(404, "lesson does not exist");
    }
    const videoLocalPath = req.file.path;
    const video = await uploadAtCloudinary(videoLocalPath);
    if (!video) {
      throw new ApiError(
        500,
        "Somethng went wrong while uploading at cloudinary",
      );
    }
    const userId = req.user._id;
    const updatedVideo = await Lesson.findOneAndUpdate(
      {
        _id: lessonId,
        createdBy: userId,
      },
      {
        $set: {
          video: {
            url: video.secure_url,
            publicId: video.public_id,
          },
        },
      },
      { new: true },
    );
    if (!updatedVideo) {
      throw new ApiError(
        400,
        "Something went wrong while updating lesson video",
      );
    }

    const deleteVideo = await deleteAtCloudinary(
      updatedVideo.video?.publicId,
      "video",
    );

    if (!deleteVideo) {
      throw new ApiError(
        500,
        "Somethng went wrong while deleting at cloudinary",
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully updated lesson video"));
  },
);
