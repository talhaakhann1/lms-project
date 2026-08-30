import { api } from "../libs/axios";
import ApiResponse from "../utils/ApiResponse";
import { Order } from "../types/interfaces/order.interface";

class OrderService {
  async create(courseId: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      `/orders/${courseId}/create`
    );

    return response.data.data;
  }

  async getAll(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(
      "/orders/all"
    );

    return response.data.data;
  }
  async getById(orderId:string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(
      `/orders/${orderId}`
    );
    return response.data.data;
  }
}

export const orderService = new OrderService();