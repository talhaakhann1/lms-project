import mongoose, { Model, Schema } from "mongoose";
import type { IReview } from "../interfaces/review.interface.js";

const reviewSchema = new Schema<IReview>({
  comment: {
    type: String,
    required:true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
},{timestamps:true});

export const Review: Model<IReview> = mongoose.model<IReview>(
  "Review",
  reviewSchema,
);
