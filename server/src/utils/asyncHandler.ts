import type { Request, RequestHandler, Response } from "express";
import type { NextFunction } from "express-serve-static-core";


const asyncHandler=(requestHandler:RequestHandler)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    }
}

export { asyncHandler };