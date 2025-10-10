import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/event/eventSlice';
import participantReducer from '../features/participant/participantSlice'

export const store =configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
        participants: participantReducer,
    },
})