import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Enrollment } from "../models/enrollment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { LessonProgress } from "../models/lessonProgress.model.js";

function commonEnrollmentAggregation(): PipelineStage[] {
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
              email: 1,
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
                    email: 1,
                  },
                },
              ],
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
              instructor: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        course: 1,
        user: 1,
        enrolledAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ];
}

export const getEnrollmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollementId = req.params.enrollementId as string;
    if (!enrollementId) {
      throw new ApiError(400, "enrollment is required");
    }
    const [enrollments] = await Enrollment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(enrollementId),
        },
      },
      ...commonEnrollmentAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrollments || [],
          "Successfully get enrollement by id",
        ),
      );
  },
);

export const getAllEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollments = await Enrollment.aggregate([
      {
        $match: {},
      },
      ...commonEnrollmentAggregation(),
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrollments || [],
          "Successfully get all enrollement ",
        ),
      );
  },
);

export const getStudentEnrollCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const enrolledCourses = await LessonProgress.aggregate([
    
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "users",
          localField: "course.instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $lookup: {
          from: "lessons",

          let: {
            courseId: "$course._id",
            completedIds: "$completedLessonIds",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$course", "$$courseId"],
                    },  
                    {
                      $not: {
                        $in: [
                          "$_id",
                          {
                            $ifNull: ["$$completedIds", []],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            {
              $sort: {
                order: 1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                _id: 1,
                title: 1,
                order: 1,
              },
            },
          ],

          as: "currentLesson",
        },
      },
      {
        $unwind: {
          path: "$currentLesson",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,

          id: "$course._id",

          title: "$course.title",

          instructor: {
            id: {
              $toString: "$instructor._id",
            },
            name: "$instructor.fullName",
          },

          thumbnailUrl: "$course.thumbnail.url",
          progressPercent: "$progress",
          currentLesson: {
            id: {
              $toString: "$currentLesson._id",
            },
            title: "$currentLesson.title",
          },
          completedLessons: 1,
          totalLessons: 1,
        },
      },
      {
        $sort: {
          enrolledAt: -1,
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrolledCourses,
          "Successfully fetched enrolled courses",
        ),
      );
  },
);
