import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  fetchUserDetailsApi,
  applyManagerApi,
  logoutApi,
} from "../Services/apiServices";


// Thunk to handle login and token storage
export const loginAdmin = createAsyncThunk("/login", async (data) => {
  const res = await loginApi(data);
  localStorage.setItem("token", res.data.token);
  return res.data.token;
});

// Thunk to fetch user details using the stored token
export const fetchUserDetails = createAsyncThunk(
  "/user/details",
  async (_, { getState }) => {
    const res = await fetchUserDetailsApi();
    return res.data;
  }
);

export const applyManager = createAsyncThunk(
  "/signup/manager",
  async (data) => {
    try {
      const res = await applyManagerApi(data);
      console.log("API response:", res);
        return res.data;
      
    } catch (error) {
      console.error("Error in applyManager thunk:", error);
      throw error;
    }
  }
);

export const logOutAdmin = createAsyncThunk("/logout", async () => {
  await logoutApi();
  localStorage.removeItem("token");
  return {};
});

const initialState = {
  token: null,
  userdata: null,
};

// Auth slice to manage authentication state
const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userdata = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userdata = action.payload;
      })
      .addCase(logOutAdmin.fulfilled, (state) => {
        state.token = null;
        state.userdata = null;
      })
      .addCase(applyManager.fulfilled, (state, action) => {
        state.userdata = action.payload;
      });
  },
});

export default authSlice.reducer;
export const {logout } = authSlice.actions;
