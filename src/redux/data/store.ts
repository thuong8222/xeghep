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
import regulationReducer from '../slices/regulationSlice';
import driverNotificationReducer from '../slices/driverNotificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    areas: areaReducer,
    trips:tripsReducer,
    terms: termsReducer,
    memberGroup: memberGroupReducer,
    point: pointReducer,
    regulations: regulationReducer,
    driverNotifications: driverNotificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
