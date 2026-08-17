export declare const emailService: {
    sendVerificationCode(email: string, fullName: string, code: string): Promise<import("resend").CreateEmailResponse>;
    sendWelcomeEmail(email: string, fullName: string): Promise<import("resend").CreateEmailResponse>;
    sendCourseCompletionEmail(email: string, fullName: string, courseName: string): Promise<import("resend").CreateEmailResponse>;
};
//# sourceMappingURL=email.d.ts.map