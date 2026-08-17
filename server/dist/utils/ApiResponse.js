class ApiResponse {
    statusCode;
    data;
    message;
    success;
    constructor(statusCode, data, message) {
        this.statusCode = statusCode,
            this.data = data,
            this.message = message,
            this.success = statusCode < 400;
    }
}
export { ApiResponse };
//# sourceMappingURL=ApiResponse.js.map