export class ApiErrorResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: unknown[] = [],
    public stack?: string
  ) {}
}

class ApiError {
  public error = true;

  constructor(
    public errorMessage: string,
    public errorData: unknown = null,
    public errorResponse: ApiErrorResponse | null = null
  ) {}
}

export default ApiError;