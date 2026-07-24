import type { Document, Types } from "mongoose";

export interface IReview extends Document{
    comment:string;
    userId:Types.ObjectId;
    courseId:Types.ObjectId;
}