class ApiError extends Error {
  statusCode: number;
  message: string;
  data: null;
  success: boolean;
  errors: unknown;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error:unknown = {},
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
