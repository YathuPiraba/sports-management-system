import axios from "axios";
import React, { useState, createContext, useContext } from "react";
import { ConfigProvider } from "antd";
import SessionExpiredPopup from "./SessionExpiredPopup";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext(null);

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSubscribers, setRefreshSubscribers] = useState([]);

  const processQueue = (error, token = null) => {
    refreshSubscribers.forEach((callback) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, token);
      }
    });
    setRefreshSubscribers([]);
  };

  const addSubscriber = (callback) => {
    setRefreshSubscribers((prev) => [...prev, callback]);
  };

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

  const AUTH_ERROR_CODES = {
    INVALID_CREDENTIALS: 'Invalid username or password',
    INVALID_REFRESH_TOKEN: 'Session expired',
    INVALID_SESSION: 'Session expired',
    NO_REFRESH_TOKEN: 'Session expired',
    REFRESH_FAILED: 'Session expired',
    ACCOUNT_DEACTIVATED: 'Account deactivated'
};

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;
      const errorCode = error.response?.data?.code;
      const errorStatus = error.response?.status;

      // Handle invalid credentials separately
      if (errorStatus === 401 && errorCode === 'INVALID_CREDENTIALS') {
          return Promise.reject(error);
      }

      // Handle token refresh for other 401 errors
      if (errorStatus === 401 && !originalRequest._retry) {
          if (isRefreshing) {
              return new Promise((resolve, reject) => {
                  addSubscriber((error, token) => {
                      if (error) {
                          reject(error);
                      } else {
                          originalRequest.headers["Authorization"] = `Bearer ${token}`;
                          resolve(authApiClient(originalRequest));
                      }
                  });
              });
          }

          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
              const res = await apiClient.post("/refresh");
              const { access_token } = res.data;
              setAuthToken(access_token);

              // Notify all subscribers about the new token
              processQueue(null, access_token);

              return authApiClient(originalRequest);
          } catch (refreshError) {
              console.error("Refresh token failed:", refreshError);
              setAuthToken(null);

              // Notify subscribers about the error
              processQueue(refreshError);

              // Show session expired popup only for actual session expiration
              const refreshErrorCode = refreshError.response?.data?.code;
              if (refreshErrorCode && refreshErrorCode !== 'INVALID_CREDENTIALS') {
                  setIsSessionExpired(true);
              }
              return Promise.reject(refreshError);
          } finally {
              setIsRefreshing(false);
          }
      }

      return Promise.reject(error);
  }
);

  const contextValue = {
    setIsSessionExpired,
    isSessionExpired,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <ConfigProvider>
        {children}
        <SessionExpiredPopup
          isOpen={isSessionExpired}
          onClose={() => setIsSessionExpired(false)}
        />
      </ConfigProvider>
    </AuthContext.Provider>
  );
};

export {
  ApiClientProvider,
  apiClient,
  authApiClient,
  setAuthToken,
  AuthContext,
};
