import type { Request, Response } from "express";
import { type PipelineStage } from "mongoose";
import { Types } from "mongoose";
export declare function commonCourseAggregation(userId?: Types.ObjectId): PipelineStage[];
export declare const createCourse: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const updateCourse: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const deleteCourse: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getCourseById: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getAllCourses: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const updateCourseThumbnail: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
//# sourceMappingURL=course.controller.d.ts.map