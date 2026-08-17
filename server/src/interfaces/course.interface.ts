import type { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  tagline: string;
  level:string;
  thumbnail: {
    url: string;
    publicId: string;
  };
  learningOutcomes: string;
  requirements: string;
  price: number;
  instructor: Types.ObjectId;
  category: string;
  isPublished: boolean;
  createdBy: Types.ObjectId;
}
