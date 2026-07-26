import apiClient from "../../../api";
import type { RegisterData } from "./types";

export const api = {
  register: (data: RegisterData) => apiClient.post("/auth/register", data),
};
