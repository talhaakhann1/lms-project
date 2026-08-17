import { User } from "next-auth";
import { Lesson } from "./lesson.interface";
import { Course } from "./course.interface";


export interface LessonProgress{
    user:User,
    course:Course,
    lesson:Lesson,
    totalLessons:number,
    completedLessons:number,
    progress:number
   isCompleted:boolean
    enrolledAt:Date
    updatedAt:string,
    createdAt:string
}