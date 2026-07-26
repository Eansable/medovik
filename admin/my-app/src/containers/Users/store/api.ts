import apiClient from "../../../api";
import type { ICreateRole, IPermission } from "../../../store/permissionsSlice";

export const apiUsers = {
  getUsers: () => apiClient.get("/users/"),
  getPermissions: () => apiClient.get("users/permissions/"),
  createPermissions: (params: IPermission) =>
    apiClient.post("users/permissions/", params),
  setPermissions: (params: { roleId: number; permissionIds: number[] }) =>
    apiClient.post(`users/roles/${params.roleId}/permissions/`, {
      permissionIds: params.permissionIds,
    }),
  getRoles: () => apiClient.get("users/roles/"),
  createRole: (params: ICreateRole) => apiClient.post("users/roles/", params),
  getOneRole: (roleId: number) => apiClient.get(`users/roles/${roleId}`),
};
