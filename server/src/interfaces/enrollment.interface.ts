import type { Document, Types } from "mongoose";

export interface IEnrollment extends Document{
    userId:Types.ObjectId;
    courseId:Types.ObjectId;
    enrolledAt:Date;
}