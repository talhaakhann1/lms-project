import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { type PipelineStage } from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { Types } from "mongoose";
import { Category } from "../models/category.model.js";

function commonCourseAggregation():PipelineStage[] {
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
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              name: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$instructor", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        instructor: 1,
        category: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];
}

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, price, instructor, isPublished, category } =
      req.body;
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
      throw new ApiError(
        500,
        "Somethng went wrong while uploading at cloudinary",
      );
    }
    const course = await Course.create({
      title,
      description,
      price,
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
      .json(
        new ApiResponse(201, createdCourse, "Successfully created the course"),
      );
  },
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, price, category } = req.body;
    const { courseId } = req.params;
    if (!courseId) {
      throw new ApiError(400, "courseId is required");
    }
    const userId = req.user._id;
    const existedCourse = await Course.findOne({
      _id: courseId,
      createdBy: userId,
    });
    if (!existedCourse) {
      throw new ApiError(404, "course does not exist or access denied");
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        createdBy: userId,
      },
      {
        $set: {
          title,
          description,
          price,
          category,
        },
      },
      { new: true },
    );
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
        ...commonCourseAggregation(),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCourse, "Successfully updated the course"),
      );
  },
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error("Delete Course Transaction aborted due to error:", error);
      throw new ApiError(500, "Failed to delete course");
    } finally {
      await session.endSession();
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully deleted the course"));
  },
);

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const  courseId  = req.params.courseId as string;
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
          _id:  new Types.ObjectId(courseId),
          isPublished: true
        },
      },
      ...commonCourseAggregation()
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, course ||[], "Successfully get course by id"),
      );
  },
);

export const getAllCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = await Course.aggregate([
      {
        $match: {
          isPublished: true,
        },
      },
      ...commonCourseAggregation()
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          courses || [],
          "Successfully get all published course",
        ),
      );
  },
);

export const updateCourseThumbnail = asyncHandler(
  async (req: Request, res: Response) => {
    const {courseId} = req.params ;
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
      throw new ApiError(
        500,
        "Somethng went wrong while uploading at cloudinary",
      );
    }
    const userId = req.user._id;
    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        createdBy: userId,
      },
      {
        $set: {
          thumbnail: {
            url: thumbnail.secure_url,
            publicId: thumbnail.public_id,
          },
        },
      },
      { new: true },
    );
    if (!updatedCourse) {
      throw new ApiError(
        400,
        "Something went wrong while updating course thumbnail",
      );
    }

    const deleteThumbnail = await deleteAtCloudinary(
      existedCourse.thumbnail?.publicId,
      "image",
    );

    if (!deleteThumbnail) {
      throw new ApiError(
        500,
        "Somethng went wrong while deleting at cloudinary",
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully updated course thumbnail"));
  },
);
