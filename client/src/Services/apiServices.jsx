import { apiClient, authApiClient } from "./apiClient";

// Login API
export const loginApi = (data) => {
  return authApiClient.post("/login", data);
};

// Fetch user details API
export const fetchUserDetailsApi = () => {
  return authApiClient.get("/details");
};

// Apply as manager API
export const applyManagerApi = (data) => {
  return apiClient.post("/manager/apply", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Apply as member API
export const applyMemberApi = (data) => {
  return apiClient.post("/member/apply", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update member verification status
export const updateMemberVerificationApi = (memberId) => {
  return authApiClient.put(`/verifyMember/${memberId}`);
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

// Reject member request
export const rejectMemberRequestApi = (memberId) => {
  return authApiClient.delete(`/deleteMember/${memberId}`);
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

export const fetchMemberPendingDataApi = (userId, page = 1, perPage = 10) => {
  return authApiClient.get("/pendingMembers", {
    params: {
      userId: userId,
      page: page,
      per_page: perPage,
    },
  });
};

// Fetch all managers data
export const fetchMemberDataApi = (userId) => {
  return authApiClient.get("/membersList", {
    params: {
      userId: userId,
    },
  });
};

export const fetchVerifiedMemberDataApi = (
  userId,
  page = 1,
  perPage = 5,
  sortBy = "name",
  sort = "asc",
  search = "",
  gender = null // New gender parameter
) => {
  const params = {
    userId,
    page,
    per_page: perPage,
    sortBy,
    sort,
    search,
  };

  // Only add gender to params if it's not null
  if (gender) {
    params.gender = gender;
  }

  return authApiClient.get("/queryMembers", { params });
};

// Fetch A member data
export const fetchMemberDetailsApi = (memberId) => {
  return authApiClient.get(`/memberDetails/${memberId}`);
};

export const fetchMemberDetailsByUserIdApi = (userId) => {
  return authApiClient.get(`/member_Details/${userId}`);
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

export const updateMemberDetailsApi = (userId, data) => {
  return authApiClient.post(`/member/update/personal/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMemberSportsAPI = (userId, data) => {
  return authApiClient.put(`/member/update/sports/${userId}`, data);
};

export const getCountsAPI = () => {
  return authApiClient.get(`/sports/counts`);
};

//deleteProfile
export const deleteProfileAPI = (userId) => {
  return authApiClient.delete(`/image/${userId}`);
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

// create a new sports category
export const createSportsAPI = (data) => {
  return apiClient.post("/sports/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// update sports category
export const updateSportsAPI = (sportsId, data) => {
  data.append("_method", "PUT");
  return authApiClient.post(`/sport/${sportsId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// get all clubs
export const getAllClubsAPI = () => {
  return apiClient.get("/clubs/list");
};

// get all clubs details
export const getAllClubsDetailsAPI = (
  page = 1,
  perPage = 5,
  sortBy = "clubName",
  sortOrder = "asc",
  search = ""
) => {
  const sortByParam =
    sortBy === "clubName" ? "club_name_sort" : "division_name_sort";

  // Create the params object
  const params = {
    page: page,
    per_page: perPage,
    search: search,
  };

  if (sortBy === "clubName" || sortBy === "divisionName") {
    params[sortByParam] = sortOrder;
  }

  // Make the API request
  return apiClient.get("/clubs/details", { params });
};

export const deleteClubRegNoAPI = (clubId) => {
  return apiClient.delete(`/club/regno/${clubId}`);
};

// get all sports
export const getAllSportsAPI = () => {
  return apiClient.get("/sports/list");
};

//get all sport arenas
export const getAllSportArenasAPI = () => {
  return apiClient.get("/arena/list");
};

// get all club sports
export const getAllClubSportsAPI = () => {
  return apiClient.get("/clubs-sports/list");
};

//create a new club sports entry
export const createClubSportsAPI = (data) => {
  return authApiClient.post("/clubs-sports/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get a specific club sports entry based on clubName
export const getAClubSportsAPI = (clubName) => {
  return apiClient.get("/clubs-sports/one", {
    params: { clubName },
  });
};

// Update Manager personal Details API
export const updateClubDetailsApi = (clubId, data) => {
  data.append("_method", "PUT");

  return authApiClient.post(`/club/${clubId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//Get specific Skills by sportsName
export const getSkillsBySportsAPI = (sportsId) => {
  return apiClient.get("/skills/by-sport", {
    params: { sportsId },
  });
};

//Get a specific club details
export const fetchClubDataAPI = (userId) => {
  return apiClient.get("/club-details", {
    params: {
      userId: userId,
    },
  });
};

export const createSportsArenaAPI = (data) => {
  return apiClient.post("/sports-arenas/create", data);
};

export const updateSportsArenaAPI = (arenaId, data) => {
  data.append("_method", "PUT");
  return authApiClient.post(`/sports-arenas/${arenaId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSportsArenasByClubAPI = (clubId) => {
  return apiClient.get("/sports-arenas/club", {
    params: { clubId },
  });
};

export const deleteSportsArenaAPI = (clubId, arenaId) => {
  return authApiClient.delete(`/arena/${clubId}/${arenaId}`);
};

export const deleteSportsAPI = (sportId) => {
  return authApiClient.delete(`/sport/${sportId}`);
};

export const deleteClubSportsAPI = (clubId, sportsId) => {
  return authApiClient.delete(`/club-sports`, {
    data: {
      club_id: clubId,
      sports_id: sportsId,
    },
  });
};

export const updateClubSportsAPI = (clubId, data) => {
  return authApiClient.put(`/club-sports/${clubId}`, data);
};

export const getSportsBySportsArenaAPI = (clubId, arenaId) => {
  return apiClient.get(`/arena/sports/${clubId}/${arenaId}`);
};

export const deactivateUserAPI = (userId) => {
  return authApiClient.delete(`/user/${userId}`);
};

export const restoreUserAPI = (userId) => {
  return authApiClient.patch(`/user/${userId}/restore`);
};

export const addEventAPI = (data) => {
  return authApiClient.post("/events", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editEventAPI = (eventId, data) => {
  data.append("_method", "PUT");
  return authApiClient.post(`/events/${eventId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllEventAPI = () => {
  return authApiClient.get(`/events/`);
};
export const getAEventAPI = (eventId) => {
  return authApiClient.get(`/events/${eventId}`);
};

export const deleteEventAPI = (eventId) => {
  return authApiClient.delete(`/events/${eventId}`);
};

export const addEventSportsAPI = (eventId, data) => {
  return authApiClient.post(`/events/${eventId}/sports`, data);
};

export const editEventSportsAPI = (eventId, event_sportsId, data) => {
  return authApiClient.put(`/events/${eventId}/sports/${event_sportsId}`, data);
};

export const deleteEventSportsAPI = (eventId, event_sportsId, data) => {
  return authApiClient.delete(
    `/events/${eventId}/sports/${event_sportsId}`,
    data
  );
};

export const getMembersBySportsAPI = (userId, sports_id) => {
  return apiClient.get("/membersBySport", {
    params: {
      userId: userId,
      sports_id: sports_id,
    },
  });
};

export const addEventParticipantsAPI = (data) => {
  return authApiClient.post(`/addEventParticipants`, data);
};

export const getEventParticipantsAPI = (eventId) => {
  return authApiClient.get(`/getEventParticipants/${eventId}`);
};

export const getEventClubsAPI = (eventId) => {
  return authApiClient.get(`events/${eventId}/sports`);
};

export const getAClubEventParticipantsAPI = (userId, selectedEvent) => {
  return authApiClient.get("/getSpecificEventParticipants", {
    params: {
      user_id: userId,
      event_id: selectedEvent,
    },
  });
};

export const getAMemberEventParticipantsAPI = (userId, eventId) => {
  return authApiClient.get("/getSpecificUserEventParticipants", {
    params: {
      user_id: userId,
      event_id: eventId,
    },
  });
};

export const fetchNotificationsAPI = () => {
  return authApiClient.get(`/notifications`);
};

export const readNotificationAPI = (notificationId) => {
  return authApiClient.post(`/notifications/${notificationId}/read`);
};

export const downloadClubDetailsAPI = async (clubId) => {
  try {
    const response = await authApiClient.get(
      `/download-club-details/${clubId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const downloadAllClubDetailsAPI = async (clubId) => {
  try {
    const response = await authApiClient.get(`/download-all-club-details`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const downloadEventSportsDetailsAPI = async (eventSportsId) => {
  try {
    const response = await authApiClient.get(
      `/download-eventsports-details/${eventSportsId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addMatchScheduleAPI = (eventSportId, data) => {
  return authApiClient.post(`event-sports/${eventSportId}/matches`, data);
};

export const getMatchSchedulesAPI = (eventId, page, perPage, search) => {
  return authApiClient.get(`/event/${eventId}/match-schedules`, {
    params: {
      page,
      per_page: perPage,
      date: search,
    },
  });
};

export const matchSchedulesDataAPI = (eventId) => {
  return authApiClient.get(`/event/match-schedules/${eventId}`);
};

export const updateMatchSchedulesAPI = (matchId, data) => {
  return authApiClient.put(`/match-schedules/${matchId}`, data);
};

export const deleteMatchSchedulesAPI = (matchId) => {
  return authApiClient.delete(`/match-schedules/${matchId}`);
};

export const downloadMatchScheduleAPI = async (eventId) => {
  try {
    const response = await authApiClient.get(
      `/download-match-schedules/${eventId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitMatchResultAPI = async (data) => {
  try {
    const response = await authApiClient.post("/matches/results", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit match result"
    );
  }
};

export const getMatchResultAPI = async (
  eventId,
  page,
  perPage,
  selectedSport
) => {
  return authApiClient.get(`/event-sports-matches/${eventId}`, {
    params: {
      page,
      per_page: perPage,
      search: selectedSport,
    },
  });
};

export const getMatchLeaderboardAPI = async (eventId) => {
  return authApiClient.get(`/events/${eventId}/sports-winners`);
};

export const downloadMatchResultAPI = async (eventId) => {
  try {
    const response = await authApiClient.get(
      `/download-match-results/${eventId}`,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMatchResultsAPI = (matchId, data) => {
  return authApiClient.put(`/matches/results/${matchId}`, data);
};

export const deleteMatchResultsAPI = (matchId) => {
  return authApiClient.delete(`/matches/results/${matchId}`);
};
