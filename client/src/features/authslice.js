import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  fetchUserDetailsApi,
  applyManagerApi,
  logoutApi,
  applyMemberApi,
} from "../Services/apiServices";
import { setAuthToken } from "../Services/apiClient";

// Thunk to handle login and token storage
export const loginAdmin = createAsyncThunk(
  "/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      const { access_token } = res.data;
      console.log(res.data);

      setAuthToken(access_token);
      return access_token;
    } catch (error) {
      const errorMessage = error.response?.data || "Login failed";
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

export const logOutAdmin = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      setAuthToken(null);
      return {};
    } catch (error) {
      const errorMessage = error.response?.data || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  token: null,
  userdata: null,
  loading: false,
  error: null,
};

// Auth slice to manage authentication state
const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userdata = null;
      state.loading = false;
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null; 
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(logOutAdmin.fulfilled, (state) => {
        state.token = null;
        state.userdata = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logOutAdmin.rejected, (state, action) => {
        state.loading = false;
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
export const { logout } = authSlice.actions;
