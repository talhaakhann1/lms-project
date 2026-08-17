import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const emailService = {
    async sendVerificationCode(email, fullName, code) {
        return resend.emails.send({
            from: process.env.MAIL_FROM,
            to: email,
            subject: "Verify your LMS account",
            html: `
        <h1>Verify your email</h1>
        <p>Hello ${fullName},</p>
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
        });
    },
    async sendWelcomeEmail(email, fullName) {
        return resend.emails.send({
            from: process.env.MAIL_FROM,
            to: email,
            subject: "Welcome to LMS 🎉",
            html: `
        <h1>Welcome, ${fullName}! 🎉</h1>
        <p>Your account has been successfully verified.</p>
        <p>We're excited to have you learning with us.</p>
      `,
        });
    },
    async sendCourseCompletionEmail(email, fullName, courseName) {
        return resend.emails.send({
            from: process.env.MAIL_FROM,
            to: email,
            subject: `Congratulations! You completed ${courseName} 🎉`,
            html: `
        <h1>Congratulations, ${fullName}! 🎉</h1>
        <p>You successfully completed:</p>
        <h2>${courseName}</h2>
        <p>Your course progress has reached 100%.</p>
      `,
        });
    },
};
//# sourceMappingURL=email.js.map