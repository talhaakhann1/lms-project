import type { Request, RequestHandler, Response } from "express";
import type { NextFunction } from "express-serve-static-core";
declare const asyncHandler: (requestHandler: RequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
export { asyncHandler };
//# sourceMappingURL=asyncHandler.d.ts.map