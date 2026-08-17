import { z } from "zod";
import { api } from "../libs/axios";

import {
  signInSchema,
  signUpSchema,
  changeRoleSchema,
  changeAvatarSchema,
  updateUserProfileSchema,
} from "../Schemas/user.schema";

import ApiResponse from "../utils/ApiResponse";
import { Instructor, User } from "../types/interfaces/user.interface";

type SignInDto = z.infer<typeof signInSchema>;
type SignUpDto = z.infer<typeof signUpSchema>;
type profileUpdateDto = z.infer<typeof updateUserProfileSchema>;
type ChangeRoleDto = z.infer<typeof changeRoleSchema>;
type ChangeAvatarDto = z.infer<typeof changeAvatarSchema>;

class AuthService {
  async login(data: SignInDto): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      "/api/auth/sign-in",
      data,
    );

    return response.data.data;
  }

  async register(data: SignUpDto): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      "/api/auth/sign-up",
      data,
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  }

  async getUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/api/auth/get-user");

    return response.data.data;
  }

  async refreshToken(): Promise<void> {
    await api.post("/api/auth/refresh-token");
  }

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  }

  async getUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>("/api/auth/get-users");

    return response.data.data;
  }
  async getInstructors(): Promise<Instructor[]> {
    const response = await api.get<ApiResponse<Instructor[]>>(
      "/api/auth/get-instructors",
    );

    return response.data.data;
  }

  async updateRole(userId: string, role: string): Promise<void> {
    const response = await api.patch<ApiResponse<void>>(
      `/api/auth/update-role/${userId}`,
      {
        role:role
      },
    );

    return response.data.data;
  }

  async changeAvatar(data: FormData): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      "/api/auth/change-avatar",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  }
  async profileUpdate(data: profileUpdateDto): Promise<User | null> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar") {
        if (value instanceof File) {
          formData.append("avatar", value);
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await api.patch<ApiResponse<User | null>>(
      "/api/auth/update-profile",
      formData,
    );
    return response.data.data;
  }
}

export const authService = new AuthService();
