import apiClient from "../../../api";

export const api = {
  getCakes: () => apiClient.get("/cakes"),
  getCake: (id: number) => apiClient.get(`/cakes/${id}`),
  createCakes: (data: unknown) => apiClient.post("/cakes", data),
  updateCakes: (id: number, data: unknown) =>
    apiClient.put(`/cakes/${id}`, data),
  deleteCakes: (id: number) => apiClient.delete(`/cakes/${id}`),
};
