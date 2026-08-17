import { Course } from "./course.interface";

export interface Video {
  url: string;
  publicId: string;
  duration: number;
}



export interface Lesson {
  id:string;
  title: string;
  description: string;
  body:string;
  order: number;
  video: Video;
  course:Course;
  instructor:{
    id:string,
    fullName:string,
    avatar:{
      url:string,
      publicId:string
    }
  }
  isPublished:boolean
   isEnrolled:boolean,
      isCompleted:boolean;
  createdAt:string,
  updatedAt:string
}

export interface LessonNavigationItem {
  id: string;
  title: string;
}


export interface LessonNavigationProps {
  previousLesson: LessonNavigationItem | null;
  nextLesson: LessonNavigationItem | null;
}
export interface LessonDetails {
  lesson: Lesson;
  navigation: LessonNavigationProps;
}