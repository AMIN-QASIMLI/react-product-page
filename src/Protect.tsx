import { Navigate } from "react-router-dom";
import { useAuthStore } from "./zustand_store";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children: <Navigate to="/register" replace />;
};
