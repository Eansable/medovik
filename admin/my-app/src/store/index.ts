import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import permissionsReducer from "./permissionsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    permissions: permissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
