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
  return apiClient.post("/manager/apply", data);
};

// Logout API
export const logoutApi = () => {
  return authApiClient.post("/logout");
};

// Update manager verification status
export const updateVerificationApi = (managerId) => {
  return authApiClient.put(`/manager/update-verification/${managerId}`);
};

// Reject manager request
export const rejectRequestApi = (clubId, userId) => {
  return authApiClient.delete(`/manager/reject/${clubId}/${userId}`);
};

// Fetch manager data
export const fetchManagerDataApi = () => {
  return authApiClient.get("/manager/list");
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
  return authApiClient.get("/manager/pending", {
    params: {
      page: page,
      per_page: perPage,
    },
  });
};

// Update Admin Details API
export const updateAdminDetailsApi = (userId, data) => {
  return authApiClient.put(`/user/admin-update/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};