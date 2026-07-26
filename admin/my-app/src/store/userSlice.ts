import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  message: string;
  token: string;
  user: {
    id: number;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    roles: string[];
    permissions: string[];
  };
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<User>,
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLoginLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser, setLoginLoading } = userSlice.actions;
export default userSlice.reducer;
