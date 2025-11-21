// redux/slices/tripsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- INTERFACES ----
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
  input_area_id: undefined,
  trips_count: 0,
  loading: false,
  error: null,
  successMessage: null,
};

// ---- AXIOS INSTANCE ----
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

// ---- FETCH TRIPS ----
export interface FetchTripsPayload {
  area_id: string;
  start_date: string;
  end_date: string;
  direction: number;
}

export const fetchTrips = createAsyncThunk<
  TripsState,
  FetchTripsPayload,
  { rejectValue: string }
>('trips/fetchTrips', async (payload, { rejectWithValue }) => {
  try {
    // Chuyển payload thành query params
    const response = await api.get('api/trips', {
      params: {
        area_id: payload.area_id,
        // start_date: payload.start_date,
        // end_date: payload.end_date,
        // direction: payload.direction,
      },
    });

    console.log('response: ', response);
    return {
      trips: response.data.data,
      // driver_areas: response.data.driver_areas,
      // input_area_id: response.data.input_area_id,
      // trips_count: response.data.trips_count,

      successMessage: response.data,
    };
  } catch (err: any) {
    console.log('err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy danh sách trips thất bại',
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
    return response.data.data || response.data; // tùy backend trả về cấu trúc
  } catch (err: any) {
    console.log('err createTrip: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Tạo chuyến thất bại',
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
    const response = await api.post(`api/trips/${tripId}/buy`);
    console.log('trips/buyTrip: ', response);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Mua chuyến thất bại',
    );
  }
});

// ---- SLICE ----
const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
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
      // existing fetchTrips cases...
      .addCase(createTrip.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.loading = false;
        state.trips.unshift(action.payload); // thêm trip mới vào đầu list
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
        // nếu backend trả dữ liệu trip mới, bạn có thể thêm vào trips list
        // state.trips.unshift(action.payload);
      })
      .addCase(buyTrip.rejected, (state, action) => {
        state.buyTripLoading = false;
        state.buyTripError = action.payload || 'Mua chuyến thất bại';
        state.buyTripSuccess = false;
      });
  },
});

export const { clearTripsMessages } = tripsSlice.actions;
export default tripsSlice.reducer;
