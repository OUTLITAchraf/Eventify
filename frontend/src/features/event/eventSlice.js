import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../services/api";

const API_URL = "http://localhost:8000/api";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data.events;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch events");
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      let response;
      
      if (eventData instanceof FormData) {
        // If FormData (with image)
        response = await api.post('/create-event', eventData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If JSON data (without image)
        response = await api.post('/create-event', eventData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to create event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-event/${eventId}`);
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete event"
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/event/${eventId}`);
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch event details');
    }
  }
)

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      let response;
      
      if (eventData instanceof FormData) {
        // If FormData (with image)
        response = await api.post(`/update-event/${id}`, eventData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If JSON data (without image)
        response = await api.put(`/update-event/${id}`, eventData);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to update event'
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("fetchEvents pending");
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
        state.error = null;
        console.log("Fetched events:", action.payload.events);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("fetchEvents rejected:", action.payload);
      });
    builder
      .addCase(createEvent.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("Create Event pending");
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events.push(action.payload);
        state.error = null;
        console.log("Event created:", action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Create Event rejected:", action.payload);
      });
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("Delete Event pending");
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
        state.error = null;
        console.log("Event deleted:", action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Delete Event rejected:", action.payload);
      });
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("fetchEventById pending");
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentEvent = action.payload;
        state.error = null;
        console.log("Event detail fetched:", action.payload);
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("fetchEventById rejected:", action.payload);
      });
    builder
      .addCase(updateEvent.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("Update Event pending");
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update both the events list and current event
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
        state.currentEvent = action.payload;
        state.error = null;
        console.log("Event updated:", action.payload);
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Update Event rejected:", action.payload);
      });
  },
});

export default eventSlice.reducer;
