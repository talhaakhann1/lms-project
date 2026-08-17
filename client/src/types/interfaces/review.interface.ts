import { User } from "@/src/Schemas/user.schema";
import { Course } from "./course.interface";



export interface Review {
  id: string;
  comment: string;
  user: User | null;
  course: Course | null;
  createdAt: string; 
  updatedAt: string; 
}