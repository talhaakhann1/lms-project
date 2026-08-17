import mongoose, { Model, Schema } from "mongoose";
import type { IEnrollment } from "../interfaces/enrollment.interface.js";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index:true },
    course: { type: Schema.Types.ObjectId, ref: "Course",index:true },
    enrolledAt: {
      type: Date,
      default:Date.now()
    },
  },
  { timestamps: true },
);

export const Enrollment: Model<IEnrollment> = mongoose.model<IEnrollment>(
  "Enrollment",
  enrollmentSchema,
);
