import type { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
  avatar: { url: string,publicId: string };
  refreshToken: string;
  accessToken: string;
  role: string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTemporaryToken(): {};
  isPasswordValid(password: string): Promise<boolean>;
}
