import { CourseLevels } from "../enums/course.enum";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  description: string;
  tagline:string;
  category: string;
  thumbnail: {
    id: string;
    fullName: string;
    url: string;
  };
  learningOutcomes:string;
  requirements:string;
  instructor: {
    id: string;
    fullName: string;
    title:string;
    bio:string;
    avatar: {
      url:string,
    };
  };
  level?: CourseLevels;
  price: number;
  isPublished:boolean
   isEnrolled: boolean,
        progress: number,
        completedLessons: number,
        totalLessons: number,
  createdAt: Date,
        updatedAt: Date,
}
