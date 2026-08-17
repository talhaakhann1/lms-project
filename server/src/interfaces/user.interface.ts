import type { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  title:string;
  bio:string;
  email: string;
  password: string;
  isVerified: boolean;
  emailVerificationToken:string;
    emailVerificationExpiry:Date;
  avatar: { url: string,publicId: string };
  refreshToken: string;
  accessToken: string;
  role: string;
  status:string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): {};
  isPasswordValid(password: string): Promise<boolean>;
}
