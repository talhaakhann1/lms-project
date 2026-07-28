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

// instructor and admin only

function commonLessonAggregation(): PipelineStage[] {
  return [
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
              description: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
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
   { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$instructor", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        description: 1,
        order: 1,
        video: 1,
        course: 1,
        instructor: 1,
        createdAt: 1,
        updatedat: 1,
      },
    },
    {
      $sort: {
        order: 1,
      },
    }
  ];
}

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, order } = req.body;
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
    const existLesson=await Lesson.findOne({
        title
    })
    if(existLesson){
      throw new ApiError(400,"lesson with this title already exist")
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
      order,
      video: {
        url: video.secure_url,
        publicId: video.public_id,
        duration: video.duration,
      },
      course: courseId,
      createdBy: userId,
    });
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
    const { title, description, order } = req.body;
    const { lessonId } = req.params;
    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }

    const existedLesson=await Lesson.findById(lessonId)

    if(!existedLesson){
      throw new ApiError(404,"lesson does not exist")
    }

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: {
          title,
          description,
          order
        },
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
    const { lessonId } = req.params;
    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }
    const userId = req.user._id;
    const lesson = await Lesson.findOne({
      _id: lessonId,
      createdBy: userId,
    });
    if (!lesson) {
      throw new ApiError(400, "lesson does not exist and access denied");
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
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully deleted the lesson"));
  },
);

// user routes

export const getLessonById = asyncHandler(
  async (req: Request, res: Response) => {
    const  lessonId  = req.params.lessonId as string;

    if (!lessonId) {
      throw new ApiError(400, "lession id is required");
    }


    const [lesson] = await Lesson.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(lessonId),
        },
      },
      ...commonLessonAggregation(),
    ]);
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, lesson || [], "Successfully get lesson by id"),
      );
  },
);
export const getAllCourseLessons = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
      if(!courseId){
        throw new ApiError(400,"courseId is required")
    }
    
    const lessons = await Lesson.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      ...commonLessonAggregation(),
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
    const {lessonId} = req.params;
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

