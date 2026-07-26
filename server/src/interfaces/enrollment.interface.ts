import type { Document, Types } from "mongoose";

export interface IEnrollment extends Document{
    user:Types.ObjectId;
    course:Types.ObjectId;
    enrolledAt:Date;
}