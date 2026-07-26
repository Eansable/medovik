import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IPermission {
  name: string;
  description?: string;
  id: number;
}

export interface IRole {
  name: string;
  description: string;
  id: number;
}

export interface IOneRole extends IRole {
  permissions: IPermission[];
}

export type ICreateRole = Omit<IRole, "id">;

export interface PermissionsState {
  permissions: IPermission[];
  roles: IRole[];
}

const initialState: PermissionsState = {
  permissions: [],
  roles: [],
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<IPermission[]>) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload;
    },
    clearRoles: (state) => {
      state.roles = [];
    },
  },
});

export default permissionsSlice.reducer;
