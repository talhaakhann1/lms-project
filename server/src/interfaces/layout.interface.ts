import type { Document, Types } from "mongoose";

export interface ILayout extends Document{
    heroBanner:string;
    faqs:string;
}