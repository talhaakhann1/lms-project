declare class ApiError extends Error {
    statusCode: number;
    message: string;
    data: null;
    success: boolean;
    errors: unknown;
    constructor(statusCode: number, message?: string, error?: unknown, stack?: string);
}
export { ApiError };
//# sourceMappingURL=ApiError.d.ts.map