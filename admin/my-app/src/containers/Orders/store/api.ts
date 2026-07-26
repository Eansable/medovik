import apiClient from "../../../api";

export const api = {
  getOrders: () => apiClient.get("/orders"),
  getOrder: (id: number) => apiClient.get(`/orders/${id}`),
  createOrder: (data: unknown) => apiClient.post("/orders", data),
  updateOrder: (id: number, data: unknown) => apiClient.put(`/orders/${id}`, data),
  deleteOrder: (id: number) => apiClient.delete(`/orders/${id}`),
};
