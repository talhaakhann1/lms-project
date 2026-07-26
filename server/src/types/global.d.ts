import "express";
import { JwtPayload } from "jsonwebtoken";
import type { IUser } from "../interfaces/user.interface.ts";
import type mongoose from "mongoose";
import { Request } from "express";


declare global{
    namespace Express{
        interface Request{
            user:{
                _id: mongoose.Types.ObjectId
                role:string
            }
        }
    }
}

export interface TokenPayload extends JwtPayload{
    _id:string
}

export {}