class ApiError extends Error {
    statusCode;
    message;
    data;
    success;
    errors;
    constructor(statusCode, message = "Something went wrong", error = {}, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = error;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map