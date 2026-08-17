import { z } from "zod";
import { api } from "../libs/axios";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../Schemas/course.schema";

import ApiResponse from "../utils/ApiResponse";
import { Course } from "../types/interfaces/course.interface";

type CreateCourseDto = z.infer<typeof createCourseSchema>;
type UpdateCourseDto = z.infer<typeof updateCourseSchema>;

class CourseService {
  async create(data :CreateCourseDto): Promise<Course> {
     const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
    const response = await api.post<ApiResponse<Course>>(
      "/api/courses/create",
      formData,
    );

    return response.data.data;
  }

  async update(
    courseId: string,
    data: UpdateCourseDto
  ): Promise<Course> {
      const formData = new FormData();

Object.entries(data).forEach(([key, value]) => {
  if (key === "thumbnail") {
    if (value instanceof File) {
      formData.append("thumbnail", value);
    }
  } else if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
});
    const response = await api.patch<ApiResponse<Course>>(
      `/api/courses/update/${courseId}`,
      formData
    );

    return response.data.data;
  }

  async updateThumbnail(
    courseId: string,
    data: FormData
  ): Promise<Course> {
    const response = await api.patch<ApiResponse<Course>>(
      `/api/courses/update-thumbnail/${courseId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  }

  async getById(courseId: string): Promise<Course> {
    const response = await api.get<ApiResponse<Course>>(
      `/api/courses/${courseId}`
    );

    return response.data.data;
  }

  async getAll(): Promise<Course[]> {
    const response = await api.get<ApiResponse<Course[]>>(
      "/api/courses"
    );

    return response.data.data;
  }

  async delete(courseId: string): Promise<void> {
    await api.delete(`/api/courses/delete/${courseId}`);
  }
}

export const courseService = new CourseService();