import "express";
import { JwtPayload } from "jsonwebtoken";
import type { IUser } from "../interfaces/user.interface.js";
import type mongoose from "mongoose";
declare global {
  namespace Express {
    interface Request {
      user: IUser;
      lessonContext?: {
        id: string | mongoose.Types.ObjectId;
        course: mongoose.Types.ObjectId;
        order: number;
      };
    }
  }
}
export interface TokenPayload extends JwtPayload {
  _id: string;
  type?: "access" | "refresh";
  email?: string;
  role?: string;
}
export {};