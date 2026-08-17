import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";


export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    next();
  };
