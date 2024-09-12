import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotificationsAPI, readNotificationAPI } from "../Services/apiServices";

// Thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await fetchNotificationsAPI();
    return res.data.data;
  }
);

// Thunk to read a notification
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (notificationId, { dispatch }) => {
    await readNotificationAPI(notificationId);
    dispatch(fetchNotifications()); 
  }
);

const initialState = {
  notifications: [],
  loading: false,
};

// Notifications slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const newNotifications = action.payload.map((event) => ({
          type: "event",
          message: `${event.club.clubName} applied for the ${event.event_sport.name}`,
          image: `${event.club.clubImage}`,
          notificationId: `${event.id}`,
        }));
        state.notifications = newNotifications;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(readNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(readNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(readNotification.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default notificationsSlice.reducer;
