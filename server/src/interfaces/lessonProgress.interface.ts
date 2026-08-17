import type { Types } from "mongoose";


export interface ILessonProgress{
    user:Types.ObjectId,
    course:Types.ObjectId,
    totalLessons:number,
    completedLessons:number,
    completedLessonIds: Types.ObjectId[];
    progress:number
    completeAt?:Date|null
    enrolledAt:Date
}