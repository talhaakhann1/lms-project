import { api } from "../libs/axios";
import ApiResponse from "../utils/ApiResponse";
import { LessonProgress } from "../types/interfaces/lessonProgress.interface";

class ProgressService {
  async completeLesson(lessonId: string): Promise<void> {
    const response = await api.patch<ApiResponse<void>>(
      `/api/lesson-progress/complete-lesson/${lessonId}`
    );

    return response.data.data;
  }
  async getLessonProgress(lessonId: string): Promise<LessonProgress> {
    const response = await api.get<ApiResponse<LessonProgress>>(
      `/api/lesson-progress/${lessonId}`
    );

    return response.data.data;
  }
}

export const progressService = new ProgressService();