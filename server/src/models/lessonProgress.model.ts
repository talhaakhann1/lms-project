import mongoose, { Model, Schema } from "mongoose";
import type { ICourse } from "../interfaces/course.interface.js";
import type { ILessonProgress } from "../interfaces/lessonProgress.interface.js";
;

const lessonProgressSchema = new Schema<ILessonProgress>(
  { 
    user: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
    completed:{
        type:Boolean,
        default:false
    },
    watchedSeconds:{
        type:Number,
        default:0,
        required:true
    },
    progress:{
        type:Number,
        default:0,
        required:true
    },
    completeAt:{
      type:Date
    },
  },
  { timestamps: true },
);

export const LessonProgress: Model<ILessonProgress> = mongoose.model<ILessonProgress>(
  "LessonProgress",
  lessonProgressSchema,
);

