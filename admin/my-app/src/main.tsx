import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { Toaster } from "sonner";
import { ConfigProvider } from "antd";
import { Header } from "./component/Header/index.tsx";
import { AppRoutes } from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/admin">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f9cd00",
            },
          }}
        >
          <Header />
          <AppRoutes />
        </ConfigProvider>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
