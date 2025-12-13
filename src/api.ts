import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQueryUser } from "./axiosInstance";

export interface Msg {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  companyName: string;
  stars: number[];
}

export interface Product {
  id?: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
  isDeletable?: boolean;
  curr: string;
  msgs: Msg[];
}

export interface User {
  id: number;
  email?: string;
  first_name: string;
  last_name?: string;
  password?: string;
  companyName?: string;
  mobile?: string;
}

interface LoginResponse {
  message: string;
  token: string;
}
interface ProfileResponse {
  message: string;
  user: User;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQueryUser(),
  tagTypes: ["Product", "User"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: "/products", method: "get" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    addProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "put",
        data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/products/${id}`, method: "delete" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    getInCarts: builder.query<Product[], void>({
      query: () => ({ url: "/inCarts", method: "get" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    addToCart: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({ url: "/inCarts", method: "post", data: product }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    removeFromCart: builder.mutation<void, number>({
      query: (id) => ({ url: `/inCarts/${id}`, method: "delete" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    getUsers: builder.query<User[], void>({
      query: () => ({ url: "/users", method: "get" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({ url: "/profile", method: "get" }),
      providesTags: (result) =>
        result ? [{ type: "User", id: result.user.id }] : [],
    }),

    addUser: builder.mutation<User, Partial<User & { password: string }>>({
      query: (user) => ({ url: "/users", method: "post", data: user }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: "delete" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (creds) => ({ url: "/login", method: "post", data: creds }),
      }
    ),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetInCartsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetUsersQuery,
  useGetProfileQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
} = api;
