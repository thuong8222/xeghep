import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Trip {
  id_trip: string;
  driver_sell: string;
  direction: number;
  is_sold: number;
  guests: number;
  time_start: string;
  price_sell: number;
  place_start: string;
  place_end: string;
  point: number;
  note: string;
  area_id: string;
  type_car: string;
  cover_car: number;
  created_at: string;
  status: number;
  drive_receive: string;
  time_receive?: string | null;
  phone_number_guest: string;
  id_quick_note?: string | null;
}

export interface DriverArea {
  id: string;
  name: string;
  province_code: string;
  code: string;
  description: string;
  is_active: number;
  created_at?: string | null;
  updated_at?: string | null;
}

interface TripsState {
  trips: Trip[];
  driver_areas: DriverArea[];
  receivedTrips: Trip[];
  soldTrips: Trip[];
  input_area_id?: string;
  trips_count: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  buyTripLoading?: boolean;
  buyTripError?: string | null;
  buyTripSuccess?: boolean;
}

const initialState: TripsState = {
  trips: [],
  driver_areas: [],
  receivedTrips: [],
  soldTrips: [],
  input_area_id: undefined,
  trips_count: 0,
  loading: false,
  error: null,
  successMessage: null,
};

export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});
export interface CreateTripPayload {
  direction: number;
  guests: number;
  time_start: string;
  price_sell: number;
  place_start: string;
  place_end: string;
  point: number;
  note?: string;
  area_id: string;
  type_car?: string;
  cover_car?: number;
  time_receive?: string | null;
  phone_number_guest: string;
}

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FetchTripsPayload {
  area_id: string;
  start_date: string;
  end_date: string;
  direction: number;
  pick_up: string;
  drop_off: string;
}

export const fetchTrips = createAsyncThunk<
  TripsState,
  FetchTripsPayload,
  { rejectValue: string }
>('trips/fetchTrips', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.get('api/trips', {
      params: {
        area_id: payload.area_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        direction: payload.direction,
        pick_up: payload.pick_up,
        drop_off: payload.drop_off,
      },
    });
    // console.log('modal truyen vao: ', {
    //   area_id: payload.area_id,
    //   start_date: payload.start_date,
    //   end_date: payload.end_date,
    //   direction: payload.direction,
    //   pick_up: payload.pick_up,
    //   drop_off: payload.drop_off,
    // });
    // console.log('fetchTrips res ', response);
    return {
      trips: response.data.data,

      successMessage: response.data,
    };
  } catch (err: any) {
    console.log('err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy danh sách trips thất bại',
    );
  }
});
export interface FetchReceivedTripsParams {
  start_date?: number;
  end_date?: number;
}

export const fetchReceivedTrips = createAsyncThunk<
  Trip[],
  FetchReceivedTripsParams,
  { rejectValue: string }
>('trips/fetchReceivedTrips', async (params, { rejectWithValue }) => {
  try {
    console.log('params chuyeesn nhajn slice: ', params);
    const response = await api.get('api/trips/received', { params });

    return response.data.data;
  } catch (err: any) {
    console.log('err chuyen nhan: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy chuyến thất bại',
    );
  }
});
export const fetchSoldTrips = createAsyncThunk<
  Trip[],
  FetchReceivedTripsParams,
  { rejectValue: string }
>('trips/fetchSoldTrips', async (params, { rejectWithValue }) => {
  try {
    console.log('params chuyen ban slice: ', params);
    const response = await api.get('api/trips/sold', { params });
    console.log('fetchSoldTrips response:', response);
    return response.data.data;
  } catch (err: any) {
    console.log('err chuyen ban: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy chuyến thất bại',
    );
  }
});

export const createTrip = createAsyncThunk<
  Trip,
  CreateTripPayload,
  { rejectValue: string }
>('trips/createTrip', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('api/trips/create', payload);
    return response.data.data || response.data;
  } catch (err: any) {
    console.log('err createTrip: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Tạo chuyến thất bại',
    );
  }
});
export const cancelTrip = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('trips/cancelTrip', async (tripId, { rejectWithValue }) => {
  try {
    console.log('HỦY CHUYẾN: ', tripId);
    const response = await api.delete(`/api/trips/${tripId}`);
    console.log('response:  huyr chuyen: ', response);
    return tripId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Hủy chuyến thất bại',
    );
  }
});
export interface BuyTripPayload {
  tripId: string;
}

export const buyTrip = createAsyncThunk<
  any,
  BuyTripPayload,
  { rejectValue: string }
>('trips/buyTrip', async ({ tripId }, { rejectWithValue }) => {
  try {
    console.log('mua chueyesn : ', tripId);
    const response = await api.post(`/api/trips/${tripId}/buy`);
    console.log('trips/buyTrip: ', response);
    return response.data;
  } catch (err: any) {
    console.log('mua chueyesn err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Mua chuyến thất bại',
    );
  }
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      const exists = state.trips.find(
        t => t.id_trip === action.payload.id_trip,
      );
      if (!exists) {
        state.trips.unshift(action.payload);
      }
    },

    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(
        t => t.id_trip === action.payload.id_trip,
      );
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },

    removeTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(t => t.id_trip !== action.payload);
    },

    addReceivedTrip: (state, action: PayloadAction<Trip>) => {
      const exists = state.receivedTrips.find(
        t => t.id_trip === action.payload.id_trip,
      );
      if (!exists) {
        state.receivedTrips.unshift(action.payload);
      }
    },

    updateReceivedTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.receivedTrips.findIndex(
        t => t.id_trip === action.payload.id_trip,
      );
      if (index !== -1) {
        state.receivedTrips[index] = action.payload;
      }
    },
    clearTripsMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTrips.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        fetchTrips.fulfilled,
        (state, action: PayloadAction<TripsState>) => {
          state.loading = false;
          state.trips = action.payload.trips;
          state.driver_areas = action.payload.driver_areas;
          state.input_area_id = action.payload.input_area_id;
          state.trips_count = action.payload.trips_count;
          state.successMessage = action.payload.successMessage;
        },
      )
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy danh sách trips thất bại';
      })

      .addCase(createTrip.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.loading = false;

        state.successMessage = 'Tạo chuyến thành công';
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tạo chuyến thất bại';
      })
      .addCase(buyTrip.pending, state => {
        state.buyTripLoading = true;
        state.buyTripError = null;
        state.buyTripSuccess = false;
      })
      .addCase(buyTrip.fulfilled, (state, action) => {
        state.buyTripLoading = false;
        state.buyTripSuccess = true;
      })
      .addCase(buyTrip.rejected, (state, action) => {
        state.buyTripLoading = false;
        state.buyTripError = action.payload || 'Mua chuyến thất bại';
        state.buyTripSuccess = false;
      })

      .addCase(fetchReceivedTrips.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReceivedTrips.fulfilled,
        (state, action: PayloadAction<Trip[]>) => {
          state.loading = false;
          state.receivedTrips = action.payload;
        },
      )
      .addCase(fetchReceivedTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy chuyến đã nhận thất bại';
      })

      .addCase(fetchSoldTrips.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSoldTrips.fulfilled,
        (state, action: PayloadAction<Trip[]>) => {
          state.loading = false;
          state.soldTrips = action.payload;
        },
      )
      .addCase(fetchSoldTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy chuyến đã nhận thất bại';
      })
      .addCase(cancelTrip.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelTrip.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;

        state.trips = state.trips.filter(t => t.id_trip !== action.payload);

        state.receivedTrips = state.receivedTrips.filter(
          t => t.id_trip !== action.payload,
        );

        state.soldTrips = state.soldTrips.filter(
          t => t.id_trip !== action.payload,
        );
        state.successMessage = 'Hủy chuyến thành công';
      })
      .addCase(cancelTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Hủy chuyến thất bại';
      });
  },
});

export const {
  addTrip,
  updateTrip,

  removeTrip,
  addReceivedTrip,
  updateReceivedTrip,
  clearTripsMessages,
} = tripsSlice.actions;
export default tripsSlice.reducer;
