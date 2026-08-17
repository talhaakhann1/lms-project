import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
export declare const validate: (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map