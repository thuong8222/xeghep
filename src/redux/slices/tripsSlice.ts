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
  display_status?: 'selling' | 'sold' | 'cancelled' | 'unsellable' | 'received';
  is_expired?: boolean;
  is_mine?: boolean;
  is_new?: boolean;
  is_unsellable?: boolean;
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
  myTrips: Trip[];
  input_area_id?: string;
  trips_count: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  buyTripLoading?: boolean;
  buyTripError?: string | null;
  buyTripSuccess?: boolean;
  editTripLoading?: boolean;
  editTripError?: string | null;
  editTripSuccess?: boolean;
}

const initialState: TripsState = {
  trips: [],
  driver_areas: [],
  receivedTrips: [],
  soldTrips: [],
  myTrips: [],
  input_area_id: undefined,
  trips_count: 0,
  loading: false,
  error: null,
  successMessage: null,
  editTripLoading: false,
  editTripError: null,
  editTripSuccess: false,
};

export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export interface CreateTripPayload {
  direction: number;
  guests: number;
  time_start: string | number;
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

// ✅ Payload cho chỉnh sửa chuyến đang bán
// Chỉ các trường được phép sửa, tất cả đều optional
export interface EditTripPayload {
  tripId: string;
  direction?: number;
  guests?: number;
  time_start?: string | number;
  price_sell?: number;
  place_start?: string;
  place_end?: string;
  point?: number;
  note?: string;
  type_car?: string;
  cover_car?: number;
  phone_number_guest?: string;
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
  sort?: 'default' | 'newest';
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
        sort: payload.sort ?? 'default',
      },
    });
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
    const response = await api.get('api/trips/received', { params });
    return response.data.data;
  } catch (err: any) {
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
    const response = await api.get('api/trips/sold', { params });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Lấy chuyến thất bại',
    );
  }
});

export const fetchMyTrips = createAsyncThunk<
  Trip[],
  FetchReceivedTripsParams & { status?: 'selling' | 'sold' | 'cancelled' },
  { rejectValue: string }
>('trips/fetchMyTrips', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('api/trips/my', { params });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Lấy chuyến của tôi thất bại',
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

// ✅ Chỉnh sửa chuyến đang bán (chỉ khi is_sold=0, status=1)
export const editTrip = createAsyncThunk<
  Trip,
  EditTripPayload,
  { rejectValue: string }
>('trips/editTrip', async ({ tripId, ...fields }, { rejectWithValue }) => {
  try {
    const response = await api.post(`api/trips/${tripId}/update`, fields);
    console.log('editTrip response: ',response);
    return response.data.data || response.data;
  } catch (err: any) {
    console.log('err editTrip: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Chỉnh sửa chuyến thất bại',
    );
  }
});

export const cancelTrip = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('trips/cancelTrip', async (tripId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/trips/${tripId}`);
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
    const response = await api.post(`/api/trips/${tripId}/buy`);
    return response.data;
  } catch (err: any) {
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
      // Cập nhật trong danh sách sàn
      const idx = state.trips.findIndex(
        t => t.id_trip === action.payload.id_trip,
      );
      if (idx !== -1) state.trips[idx] = action.payload;

      // Cập nhật trong myTrips nếu có
      const myIdx = state.myTrips.findIndex(
        t => t.id_trip === action.payload.id_trip,
      );
      if (myIdx !== -1) state.myTrips[myIdx] = action.payload;
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

    // ✅ Reset trạng thái edit sau khi dùng xong
    resetEditTrip: state => {
      state.editTripLoading = false;
      state.editTripError = null;
      state.editTripSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
      // ── fetchTrips ────────────────────────────────────────────
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

      // ── createTrip ────────────────────────────────────────────
      .addCase(createTrip.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.loading = false;
        state.successMessage = 'Tạo chuyến thành công';
        // Thêm vào myTrips ngay sau khi tạo
        state.myTrips.unshift(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tạo chuyến thất bại';
      })

      // ── editTrip ──────────────────────────────────────────────
      .addCase(editTrip.pending, state => {
        state.editTripLoading = true;
        state.editTripError = null;
        state.editTripSuccess = false;
      })
      .addCase(editTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.editTripLoading = false;
        state.editTripSuccess = true;
        state.editTripError = null;

        // ✅ Cập nhật trong myTrips
        const myIdx = state.myTrips.findIndex(
          t => t.id_trip === action.payload.id_trip,
        );
        if (myIdx !== -1) {
          state.myTrips[myIdx] = action.payload;
        }

        // ✅ Cập nhật trong danh sách sàn nếu có
        const tripIdx = state.trips.findIndex(
          t => t.id_trip === action.payload.id_trip,
        );
        if (tripIdx !== -1) {
          state.trips[tripIdx] = action.payload;
        }
      })
      .addCase(editTrip.rejected, (state, action) => {
        state.editTripLoading = false;
        state.editTripSuccess = false;
        state.editTripError = action.payload || 'Chỉnh sửa chuyến thất bại';
      })

      // ── buyTrip ───────────────────────────────────────────────
      .addCase(buyTrip.pending, state => {
        state.buyTripLoading = true;
        state.buyTripError = null;
        state.buyTripSuccess = false;
      })
      .addCase(buyTrip.fulfilled, state => {
        state.buyTripLoading = false;
        state.buyTripSuccess = true;
      })
      .addCase(buyTrip.rejected, (state, action) => {
        state.buyTripLoading = false;
        state.buyTripError = action.payload || 'Mua chuyến thất bại';
        state.buyTripSuccess = false;
      })

      // ── fetchReceivedTrips ────────────────────────────────────
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

      // ── fetchSoldTrips ────────────────────────────────────────
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
        state.error = action.payload || 'Lấy chuyến đã bán thất bại';
      })

      // ── fetchMyTrips ──────────────────────────────────────────
      .addCase(fetchMyTrips.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyTrips.fulfilled,
        (state, action: PayloadAction<Trip[]>) => {
          state.loading = false;
          state.myTrips = action.payload;
        },
      )
      .addCase(fetchMyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy chuyến của tôi thất bại';
      })

      // ── cancelTrip ────────────────────────────────────────────
      .addCase(cancelTrip.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelTrip.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Xóa khỏi danh sách sàn
        state.trips = state.trips.filter(t => t.id_trip !== action.payload);
        state.receivedTrips = state.receivedTrips.filter(
          t => t.id_trip !== action.payload,
        );
        state.soldTrips = state.soldTrips.filter(
          t => t.id_trip !== action.payload,
        );
        // Cập nhật display_status trong myTrips thành cancelled thay vì xóa
        const myIdx = state.myTrips.findIndex(
          t => t.id_trip === action.payload,
        );
        if (myIdx !== -1) {
          state.myTrips[myIdx] = {
            ...state.myTrips[myIdx],
            display_status: 'cancelled',
            is_sold: 2,
            status: 0,
          };
        }
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
  resetEditTrip,
} = tripsSlice.actions;

export default tripsSlice.reducer;
