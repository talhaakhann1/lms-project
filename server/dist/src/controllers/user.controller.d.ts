import type { Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const loginUser: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const logoutUser: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const refreshAccessToken: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const changeUserAvatar: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getCurrentUser: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getUsers: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getAllInstructors: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const assignRole: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const updateUserProfile: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
//# sourceMappingURL=user.controller.d.ts.map