import { Course } from "./course.interface";
import { User } from "./user.interface";


export interface Enrollment {
    id:string;
    user:User;
    course:Course;
    enrolledAt:Date;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  instructor: {
    id: string;
    name: string;
  };
  thumbnailUrl: string;
  progressPercent: number;
  currentLesson?: {
    id: string;
    title: string;
    order: number;
  };
  completedLessons: number;
  totalLessons: number;
}