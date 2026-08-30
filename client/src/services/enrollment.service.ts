import { api } from "../libs/axios";
import ApiResponse from "../utils/ApiResponse";
import { EnrolledCourse, Enrollment } from "../types/interfaces/enrollment.interface";

class EnrollmentService {
  async getMyCourses(): Promise<EnrolledCourse[]> {
  const response = await api.get<ApiResponse<EnrolledCourse[]>>(
    "/enrollments/my-courses"
  );

  return response.data.data;
}

  async getAll(): Promise<Enrollment[]> {
    const response = await api.get<ApiResponse<Enrollment[]>>(
      "/enrollments/all"
    );

    return response.data.data;
  }

  async getById(enrollmentId: string): Promise<Enrollment> {
    const response = await api.get<ApiResponse<Enrollment>>(
      `/enrollment/${enrollmentId}`
    );

    return response.data.data;
  }
}

export const enrollmentService = new EnrollmentService();