import type { Document, Types } from "mongoose";

export interface ICourse extends Document{
    title:string
    description:string
    thumbnail:{
        url:string;
    }
    price:number,
    intructorId:Types.ObjectId,
    categoryId:Types.ObjectId,
    isPublished:boolean
}