import { z } from "zod";
import { api } from "../libs/axios";

import {
  createReviewSchema,
  updateReviewSchema,
} from "../Schemas/review.schema";

import ApiResponse from "../utils/ApiResponse";
import { Review } from "../types/interfaces/review.interface";

type CreateReviewDto = z.infer<typeof createReviewSchema>;
type UpdateReviewDto = z.infer<typeof updateReviewSchema>;

class ReviewService {
  async create(
    courseId: string,
    data: CreateReviewDto
  ): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(
      `/reviews/create/${courseId}`,
      data
    );

    return response.data.data;
  }

  async update(
    reviewId: string,
    data: UpdateReviewDto
  ): Promise<Review> {
    const response = await api.patch<ApiResponse<Review>>(
      `/reviews/update/${reviewId}`,
      data
    );

    return response.data.data;
  }

  async delete(reviewId: string): Promise<void> {
    await api.delete(`/api/reviews/${reviewId}`);
  }

  async getCourseReviews(courseId: string): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(
      `/reviews/course/${courseId}`
    );

    return response.data.data;
  }
}

export const reviewService = new ReviewService();