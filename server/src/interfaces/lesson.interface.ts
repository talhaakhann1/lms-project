import { Document, Types } from "mongoose"

export interface IVideo {
    url:string
}

export interface ILesson extends Document{
    title:string,
    description:string;
    order:number;
    videoUrls:IVideo[];
    courseId:Types.ObjectId;
}