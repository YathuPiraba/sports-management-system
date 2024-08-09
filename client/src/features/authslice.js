import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAdmin = createAsyncThunk("/login", async (data) => {
  const res = await axios.post(`http://127.0.0.1:8000/api/login`, data);
  console.log({ res });
  localStorage.setItem("token", res.data.token);
  return res.data;
});

export const applyManager = createAsyncThunk("/signup/manager", async (data) => {
  const res = await axios.post(`http://127.0.0.1:8000/api/manager/apply`, data);
  console.log({ res });
  return res.data;
});

export const logOutAdmin = createAsyncThunk("/logout", async () => {
  await axios.post(`http://127.0.0.1:8000/api/logout`);
  localStorage.removeItem("token");
  return {};
});

const initialState = {
  userdata: null,
};

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.userdata = action.payload;
    },
    logout: (state, action) => {
      state.userdata = null;
    },
    apply:(state,action)=> {
      state.userdata = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { login, logout,apply } = authSlice.actions;
