import type { Request, Response } from "express";
export interface RevenuePoint {
    label: string;
    revenue: number;
}
export interface OrderPoint {
    label: string;
    orders: number;
}
export declare const getAdminMetrics: (req: Request, res: Response, next: import("express-serve-static-core").NextFunction) => void;
//# sourceMappingURL=admin.controller.d.ts.map