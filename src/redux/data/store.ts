// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/ authSlice';
import driverReducer from '../slices/driverSlice';
import areaReducer from '../slices/areasSlice';
import tripsReducer from '../slices/tripsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    areas: areaReducer,
    trips:tripsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
