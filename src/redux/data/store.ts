import { members } from './../../dataDemoJson';
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/ authSlice';
import driverReducer from '../slices/driverSlice';
import areaReducer from '../slices/areasSlice';
import tripsReducer from '../slices/tripsSlice';
import termsReducer from '../slices/termsPolicySlice';
import memberGroupReducer from '../slices/membersGroup';
import pointReducer from '../slices/pointSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    areas: areaReducer,
    trips:tripsReducer,
    terms: termsReducer,
    memberGroup: memberGroupReducer,
    point: pointReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
