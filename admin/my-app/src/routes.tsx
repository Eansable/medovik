import { App } from "./App";
import { Login } from "./containers/Login";
import { Routes } from "react-router";
import { Route } from "react-router";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
