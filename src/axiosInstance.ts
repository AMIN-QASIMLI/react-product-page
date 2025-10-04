import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

const DEFAULT_BASE_URL = "http://localhost:3001";

export const axiosInstance = axios.create({
  baseURL: DEFAULT_BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({ baseUrl = "" } = { baseUrl: "" }) =>
  async ({
    url,
    method,
    data,
    params,
    headers,
  }: {
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }) => {
    try {
      const result = await axiosInstance.request({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      } as AxiosRequestConfig);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

export const axiosBaseQueryUser = (opts: { baseUrl?: string } = {}): BaseQueryFn<
  {
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  },
  unknown,
  unknown
> =>
  async ({
    url,
    method,
    data,
    params,
    headers,
  }: {
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const mergedHeaders: Record<string, string> = {
        ...(headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const result = await axiosInstance.request({
        url: (opts.baseUrl ?? "") + url,
        method,
        data,
        params,
        headers: mergedHeaders,
      } as AxiosRequestConfig);

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
