
import { Course } from "./course.interface";
import { User } from "./user.interface";



export interface Review {
  id: string;
  comment: string;
  user: User | null;
  course: Course | null;
  createdAt: string; 
  updatedAt: string; 
}