import type { Document, Types } from "mongoose";

export interface IEnrollment extends Document{
    user:Types.ObjectId;
    course:Types.ObjectId;
    totalLessons:number,
    completedLessons:number,
    progress:number
    enrolledAt:Date;
    completedAt:Date;
}