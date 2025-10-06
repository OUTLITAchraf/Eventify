import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
        console.log("registerUser pending"); // Debugging
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.message = action.payload.message;
        state.error = null;
        console.log("registerUser fulfilled", action.payload); // Debugging
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.errors || action.payload.message;
        console.error("registerUser rejected", action.payload); // Debugging
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("LoginUser pending")
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        console.log("LoginUser Fulfilled", action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.log("LoginUser Rejected", action.payload)
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
