import apiClient from "../../../api";
import type { ILoginData } from "./types";

export const api = {
  login: (data: ILoginData) => apiClient.post("/auth/login", data),
  me: () => apiClient.get("/me"),
  changePassword: (data: {currentPassword: string; newPassword: string}) => apiClient.patch("/auth/password", data),
};
