import mongoose, { Model, Schema } from "mongoose";
import type { ILesson, IVideo } from "../interfaces/lesson.interface.js";

const lessonSchema = new Schema<ILesson>(
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
    order: {
      type: Number,
      unique:true,
      required: true,
    },
    videoUrls: {
      type: [String],
      default: [],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true },
);

export const Lesson: Model<ILesson> = mongoose.model<ILesson>(
  "Lesson",
  lessonSchema,
);
