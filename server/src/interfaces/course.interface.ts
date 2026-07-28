import type { Document, Types } from "mongoose";

export interface ICourse extends Document{
    title:string
    description:string
    thumbnail:{
        url:string;
        publicId: string;
    }
    price:number,
    instructor:Types.ObjectId,
    category:Types.ObjectId,
    isPublished:boolean
    createdBy:Types.ObjectId
}