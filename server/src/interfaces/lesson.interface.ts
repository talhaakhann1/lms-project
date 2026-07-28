import { Document, Types } from "mongoose";

export interface IVideo {
  url: string;
  publicId: string;
  duration: Number;
}

export interface ILesson extends Document {
  title: string;
  description: string;
  order: number;
  video: IVideo;
  course: Types.ObjectId;
  createdBy: Types.ObjectId;
}
