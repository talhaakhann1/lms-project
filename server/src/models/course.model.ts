import mongoose, { Model, Schema } from "mongoose";
import type { ICourse } from "../interfaces/course.interface.js";

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      unique:true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      url: {
        type: String,
      }
    },
    price: {
      type: Number,
      required: true
    },
    intructorId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    isPublished: {
      type: Boolean,
      default:false
    },
  },
  { timestamps: true },
);

export const Course: Model<ICourse> = mongoose.model<ICourse>(
  "Course",
  courseSchema,
);
