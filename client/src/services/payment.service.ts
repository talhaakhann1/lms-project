import { api } from "../libs/axios";
import ApiResponse from "../utils/ApiResponse";
import { Payment } from "../types/interfaces/payment.interface";

class PaymentService {
  async createPaymentSession(orderId: string): Promise<string> {
  const response = await api.post<
    ApiResponse<{ url: string }>
  >(`/payments/create-payment-session/${orderId}`);

  return response.data.data.url;
}

  async getByOrderId(orderId: string): Promise<Payment> {
    const response = await api.get<ApiResponse<Payment>>(
      `/payments/${orderId}`
    );
      return response.data.data;
  }


  async getByAll(): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>(
      "/payments/all"
    );
  return response.data.data;
  }

}

export const paymentService = new PaymentService();