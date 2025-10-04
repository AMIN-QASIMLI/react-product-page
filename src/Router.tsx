import { BrowserRouter, Route, Routes } from "react-router";
import { App } from "./App";
import { TestApi } from "./TestApi";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { InCart } from "./InCart";
import { Product } from "./Product";
import { ProtectedRoute } from "./Protect";
import { UserInformations } from "./UserInformations"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/test-api" element={<TestApi />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inCart" element={<InCart />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/user" element={<UserInformations />} />
        <Route path="/user/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
