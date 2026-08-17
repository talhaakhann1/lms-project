import type { Request, Response } from "express";
export declare const verifyJWT: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const getLoggedInUserOrIgnore: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const verifyRoles: (roles?: string[]) => (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
export declare const verifyEnrollment: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map