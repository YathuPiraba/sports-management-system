import axios from "axios";
import React, { useState } from "react";
import { ConfigProvider } from "antd";
import SessionExpiredPopup from "./SessionExpiredPopup";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const authApiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    authApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete authApiClient.defaults.headers.common["Authorization"];
  }
};

const ApiClientProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  authApiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  authApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await apiClient.post("/refresh");
          const { access_token } = res.data;
          localStorage.setItem("access_token", access_token);
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          return authApiClient(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          localStorage.removeItem("access_token");
          // Check if the refresh token has expired
          if (refreshError.response && refreshError.response.status === 401) {
            setIsSessionExpired(true);
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <ConfigProvider>
      {children}
      <SessionExpiredPopup
        isOpen={isSessionExpired}
        onClose={() => setIsSessionExpired(false)}
      />
    </ConfigProvider>
  );
};

export { ApiClientProvider, apiClient, authApiClient, setAuthToken };
