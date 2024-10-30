import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  fetchUserDetailsApi,
  applyManagerApi,
  logoutApi,
  applyMemberApi,
} from "../Services/apiServices";
import { setAuthToken } from "../Services/apiClient";

export const loginAdmin = createAsyncThunk(
  "/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      const { access_token, session_id } = res.data;

      // Store access token
      setAuthToken(access_token);

      return { access_token, session_id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logOutAdmin = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      setAuthToken(null);
      return {};
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to fetch user details using the stored token
export const fetchUserDetails = createAsyncThunk(
  "/user/details",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUserDetailsApi();
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || "Failed to fetch user details";
      return rejectWithValue(errorMessage);
    }
  }
);

export const applyManager = createAsyncThunk(
  "/signup/manager",
  async (data, { rejectWithValue }) => {
    try {
      const res = await applyManagerApi(data);
      console.log("API response:", res);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data || "Manager signup failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const applyMember = createAsyncThunk(
  "/signup/member",
  async (data, { rejectWithValue }) => {
    try {
      const res = await applyMemberApi(data);
      console.log("API response:", res);
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data || "Member signup failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  token: null,
  sessionId: null,
  userdata: null,
  loading: false,
  error: null,
  logoutLoading: false,
  loginLoading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.sessionId = null;
      state.userdata = null;
      state.loading = false;
      state.error = null;
      state.logoutLoading = false;
      state.loginLoading = false;
    },
    refreshToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.sessionId = action.payload.session_id;
        state.loginLoading = false;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userdata = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logOutAdmin.pending, (state) => {
        state.logoutLoading = true;
        state.error = null;
      })
      .addCase(logOutAdmin.fulfilled, (state) => {
        state.token = null;
        state.userdata = null;
        state.logoutLoading = false;
        state.error = null;
      })
      .addCase(logOutAdmin.rejected, (state, action) => {
        state.logoutLoading = false;
        state.error = action.payload;
      })
      .addCase(applyManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyManager.fulfilled, (state, action) => {
        state.userdata = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(applyManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyMember.fulfilled, (state, action) => {
        state.userdata = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(applyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
export const { logout,refreshToken } = authSlice.actions;
