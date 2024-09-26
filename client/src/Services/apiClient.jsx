import axios from "axios";

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
    console.log("Error occurred", error.response.status);  // Error log

    // Check if it's a 401 error
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Attempting to refresh token...");
        const res = await authApiClient.post("/refresh");
        const { access_token } = res.data;
        console.log("New access token:", access_token);

        localStorage.setItem("access_token", access_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return authApiClient(originalRequest); // Retry request
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError.response.status, refreshError.message);
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    authApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete authApiClient.defaults.headers.common["Authorization"];
  }
};

export { apiClient, authApiClient };
