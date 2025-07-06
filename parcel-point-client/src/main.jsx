import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Router/Router";
import "aos/dist/aos.css";
import AOS from "aos";
import AuthProvider from "./AllContext/AuthProvide/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a client
const queryClient = new QueryClient();
AOS.init();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist w-[95vw] mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
