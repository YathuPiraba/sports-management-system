import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAdmin = createAsyncThunk("/login", async (data) => {
  const res = await axios.post(`http://127.0.0.1:8000/api/login`, data);
  console.log({ res });
  localStorage.setItem("token", res.data.token);
  return res.data;
});

export const logOutAdmin = createAsyncThunk("/logout", async () => {
  await axios.post(`http://127.0.0.1:8000/api/logout`);
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  return {};
});

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
