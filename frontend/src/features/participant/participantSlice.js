import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunk to handle participant registration
export const registerParticipant = createAsyncThunk(
  "events/registerParticipant",
  async (registrationData, { rejectWithValue }) => {
    try {
      // registrationData should be { name, email, event_id }
      const response = await api.post("/register-participant", registrationData);
      // Returns { message: 'Registration successful...', participant: {...} } on success
      return response.data; 
    } catch (error) {
      // The backend returns a 409 Conflict with a 'message' on duplicate registration
      return rejectWithValue(
        error.response?.data?.message || "Failed to register for the event."
      );
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  registrationInfo: null, // Stores the successful response data
};

const participantSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    // Utility action to clear the status after a successful or failed registration prompt
    resetRegistrationStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.registrationInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(registerParticipant.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.registrationInfo = null;
        console.log("");
      })
      // Fulfilled (Success)
      .addCase(registerParticipant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registrationInfo = action.payload;
        state.error = null;
      })
      // Rejected (Failure)
      .addCase(registerParticipant.rejected, (state, action) => {
        state.status = 'failed';
        // action.payload contains the error message from rejectWithValue
        state.error = action.payload; 
        state.registrationInfo = null;
      });
  },
});

export const { resetRegistrationStatus } = participantSlice.actions;

export default participantSlice.reducer;