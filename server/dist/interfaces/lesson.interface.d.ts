import { Document, Types } from "mongoose";
export interface IVideo {
    url: string;
    publicId: string;
    duration: Number;
}
export interface ILesson extends Document {
    title: string;
    description: string;
    body: string;
    order: number;
    video: IVideo;
    instructor: Types.ObjectId;
    course: Types.ObjectId;
    isPublished: boolean;
    createdBy: Types.ObjectId;
}
//# sourceMappingURL=lesson.interface.d.ts.map