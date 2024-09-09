import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  fetchUserDetailsApi,
  applyManagerApi,
  logoutApi,
  applyMemberApi,
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

export const applyMember = createAsyncThunk(
  "/signup/member",
  async (data) => {
    try {
      const res = await applyMemberApi(data);
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
  loading: false,
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
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginAdmin.pending, (state) => {
      state.loading = true;  
    })
    .addCase(loginAdmin.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;  
    })
    .addCase(loginAdmin.rejected, (state) => {
      state.loading = false;  
    })
    .addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.userdata = action.payload;
      state.loading = false;
    })
    .addCase(fetchUserDetails.rejected, (state) => {
      state.loading = false;
    })
    .addCase(logOutAdmin.pending, (state) => {
      state.loading = true;
    })
    .addCase(logOutAdmin.fulfilled, (state) => {
      state.token = null;
      state.userdata = null;
      state.loading = false;
    })
    .addCase(logOutAdmin.rejected, (state) => {
      state.loading = false;
    })
    .addCase(applyManager.pending, (state) => {
      state.loading = true;
    })
    .addCase(applyManager.fulfilled, (state, action) => {
      state.userdata = action.payload;
      state.loading = false;
    })
    .addCase(applyManager.rejected, (state) => {
      state.loading = false;
    })
    .addCase(applyMember.pending, (state) => {
      state.loading = true;
    })
    .addCase(applyMember.fulfilled, (state, action) => {
      state.userdata = action.payload;
      state.loading = false;
    })
    .addCase(applyMember.rejected, (state) => {
      state.loading = false;
    });
},
});


export default authSlice.reducer;
export const { logout } = authSlice.actions;
