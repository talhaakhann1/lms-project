import { z } from "zod";
import { api } from "../libs/axios";
import {
  createLessonSchema,
  updateLessonSchema,
} from "../Schemas/lession.scehma";

import ApiResponse from "../utils/ApiResponse";
import { Lesson, LessonDetails } from "../types/interfaces/lesson.interface";
import { log } from "console";

type CreateLessonDto = z.input<typeof createLessonSchema>;
type UpdateLessonDto = z.input<typeof updateLessonSchema>;

class LessonService {
  async create(courseId: string, data: CreateLessonDto): Promise<Lesson> {
      const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
    const response = await api.post<ApiResponse<Lesson>>(
      `/lessons/create/${courseId}`,
      formData
    );

    return response.data.data;
  }

  async update(
    lessonId: string,
    data: UpdateLessonDto
  ): Promise<Lesson> {
     const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  console.log(formData);
  
    const response = await api.patch<ApiResponse<Lesson>>(
      `/lessons/update/${lessonId}`,
      formData
    );

    return response.data.data;
  }

  async updateVideo(
    lessonId: string,
    data: FormData
  ): Promise<Lesson> {
    const response = await api.patch<ApiResponse<Lesson>>(
      `/lessons/update-video/${lessonId}`,
      data
    );

    return response.data.data;
  }

  async getById(lessonId: string): Promise<LessonDetails> {
    const response = await api.get<ApiResponse<LessonDetails>>(
      `/lessons/lesson/${lessonId}`
    );

    return response.data.data;
    
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    const response = await api.get<ApiResponse<Lesson[]>>(
      `/lessons/${courseId}`
    );

    return response.data.data;
  }

  async delete(lessonId: string): Promise<void> {
    await api.delete(`/lessons/delete/${lessonId}`);
  }
}

export const lessonService = new LessonService();