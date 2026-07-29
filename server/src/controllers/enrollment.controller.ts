import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Enrollment } from "../models/enrollment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";

//Admin only

function commonEnrollmentAggregation():PipelineStage[]{
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
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                title: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
      { $unwind: "$course" },
      {
        $project:{
            _id:0,
            id:{$toString:"$_id"},
            course:1,
            user:1,
        }
      },
      {$sort:{createdAt:-1}}
  ]
}

export const getEnrollmentById=asyncHandler(async(req: Request, res: Response)=>{
  const enrollementId=req.params.enrollementId as string
  if(!enrollementId){
    throw new ApiError(400,"enrollment is required")
  }
    const [enrollments]=await Enrollment.aggregate([
        {
            $match:{
              _id:new mongoose.Types.ObjectId(enrollementId)
            }
        },
        ...commonEnrollmentAggregation()
    ])
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
)
export const getAllEnrollment=asyncHandler(async(req: Request, res: Response)=>{
    const enrollments=await Enrollment.aggregate([
        {
            $match:{}
        },
        ...commonEnrollmentAggregation()
    ])
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
)