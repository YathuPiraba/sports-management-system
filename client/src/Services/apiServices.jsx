import { apiClient, authApiClient } from "./apiClient";

// Login API
export const loginApi = (data) => {
  return apiClient.post("/login", data);
};

// Fetch user details API
export const fetchUserDetailsApi = () => {
  return authApiClient.get("/user/details");
};

// Apply as manager API
export const applyManagerApi = (data) => {
  return apiClient.post("/manager/apply", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Logout API
export const logoutApi = () => {
  return authApiClient.post("/logout");
};

// Update manager verification status
export const updateVerificationApi = (managerId) => {
  return authApiClient.put(`/manager/update-verification/${managerId}`);
};

// Fetch GS data
export const fetchGSDataApi = () => {
  return apiClient.get("/gs-divisions/list");
};

// Reject manager request
export const rejectRequestApi = (clubId, userId) => {
  return authApiClient.delete(`/manager/reject/${clubId}/${userId}`);
};

// Fetch all managers data
export const fetchManagerDataApi = () => {
  return authApiClient.get("/manager/list");
};

// Fetch A manager data
export const fetchManagerDetailApi = (userId) => {
  return authApiClient.get(`/manager/${userId}`);
};

// Fetch manager data with query
export const fetchManagerQueryDataApi = (page = 1, perPage = 10) => {
  return authApiClient.get("/manager/query", {
    params: {
      page: page,
      per_page: perPage,
    },
  });
};

// Fetch pending request
export const fetchManagerPendingDataApi = (page = 1, perPage = 10) => {
  return authApiClient.get("/pending", {
    params: {
      page: page,
      per_page: perPage,
    },
  });
};

// Update Admin Details API
export const updateAdminDetailsApi = (userId, data) => {
  data.append("_method", "PUT");

  return authApiClient.post(`/user/admin-update/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update Manager personal Details API
export const updateManagerDetailsApi = (userId, data) => {
  data.append("_method", "PUT");

  return authApiClient.post(`/manager/update/personal/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Forgot-Password API
export const forgotPasswordAPI = (data) => {
  return apiClient.post("/forgot-password", data);
};

//Verify-OTP API
export const verifyOtpAPI = (data) => {
  return apiClient.post("/verify-otp", data);
};

//Reset-Password API
export const resetPasswordAPI = (data) => {
  return apiClient.post("/reset-password", data);
};
