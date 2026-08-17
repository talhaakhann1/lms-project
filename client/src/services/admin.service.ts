import { api } from "../libs/axios";
import ApiResponse from "../utils/ApiResponse";
import { AdminMetrics } from "../types/interfaces/admin.interface";

class AdminService {
async getMetrics(): Promise<AdminMetrics> {
  const response = await api.get<ApiResponse<AdminMetrics>>(
    "/api/admin/metrics"
  );

  return response.data.data;
}
}
  

export const adminService = new AdminService();
