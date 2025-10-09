import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/login",
        credentials,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

export const LogoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/logout");
      localStorage.removeItem('token'); 
      return;
    } catch (error) {
      localStorage.removeItem('token'); 
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/user');
        return response.data;
      } catch (error) {
        localStorage.removeItem('token');
        return rejectWithValue(error.response?.data || "Failed to fetch user");
      }
    }
  );


const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("RegisterUser pending");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming registration also returns a token
        if (action.payload.token) {
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        }
        state.user = action.payload.user || null;
        state.error = null;
        console.log("RegisterUser Fulfilled", action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("RegisterUser Rejected", action.payload);
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.log("LoginUser Rejected", action.payload)
      });
    
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("fetchUser pending");
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
        console.log("fetchUser fulfilled", action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("fetchUser rejected", action.payload);
      });

    builder
      .addCase(LogoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("LogoutUser pending");
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
        console.log("LogoutUser fulfilled");
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = action.payload;
        console.error("LogoutUser rejected", action.payload);
      });
  },
});

export const { setToken, clearAuth } = authSlice.actions;

export default authSlice.reducer;