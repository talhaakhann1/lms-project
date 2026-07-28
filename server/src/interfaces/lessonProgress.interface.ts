import type { Types } from "mongoose";


export interface ILessonProgress{
    user:Types.ObjectId,
    course:Types.ObjectId,
    lesson:Types.ObjectId,
    completed:boolean,
    watchedSeconds:number,
    progress:number,
    completeAt:Date
}