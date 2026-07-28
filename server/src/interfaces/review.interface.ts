import type { Document, Types } from "mongoose";

export interface IReview extends Document{
    comment:string;
    user:Types.ObjectId;
    course:Types.ObjectId;
}