// redux/slices/driverSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Driver {
    id: string;               // API trả về id là string (UUID)
    full_name: string;
    image_avatar:string;
    phone: string;
    address?: string;
    birth_date?: string | null;
    gender?: string | null;
    email?: string | null;
    experience_years?: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    type_car: string;
    status_car: number;
    license_number?: string | null;
    color_car?: string | null;
    model_car?: string | null;
    name_car?: string | null;
    image_car?: string | null;
    year_car?: string | null;
  }
  

interface DriverState {
  driver: Driver | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DriverState = {
  driver: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const api = axios.create({
    baseURL: AppConfig.BASE_URL,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  
  // Thêm interceptor
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  


// ---- GET DRIVER INFO ----
export const fetchDriver = createAsyncThunk<Driver, void, { rejectValue: string }>(
  'driver/fetchDriver',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/auth/me');

      return response.data.data;
    } catch (err: any) {
        console.log('driverSlice err: ',err)
      return rejectWithValue(err.response?.data?.message || 'Lấy thông tin driver thất bại');
    }
  }
);

// ---- UPDATE DRIVER INFO ----
export const updateDriver = createAsyncThunk<Driver, Partial<Driver>, { rejectValue: string }>(
  'driver/updateDriver',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put('api/auth/me', payload);
      return response.data.data.driver;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  }
);
// ---- CHANGE PASSWORD ----
export const changeDriverPassword = createAsyncThunk<
  string, 
  { current_password: string; password: string; confirm_password: string }, 
  { rejectValue: string }
>(
  'driver/changeDriverPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('api/auth/password/change', payload);
      // Giả sử API trả về message thành công
      return response.data.message || 'Thay đổi mật khẩu thành công';
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Thay đổi mật khẩu thất bại');
    }
  }
);
const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    clearDriverMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH DRIVER
      .addCase(fetchDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchDriver.fulfilled, (state, action: PayloadAction<Driver>) => {
        state.loading = false;
        state.driver = action.payload;
      })
      .addCase(fetchDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy thông tin thất bại';
      })

      // UPDATE DRIVER
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateDriver.fulfilled, (state, action: PayloadAction<Driver>) => {
        state.loading = false;
        state.driver = action.payload;
        state.successMessage = 'Cập nhật thành công';
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Cập nhật thất bại';
      })

      // CHANGE PASSWORD
      .addCase(changeDriverPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changeDriverPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload; // message thành công
      })
      .addCase(changeDriverPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Thay đổi mật khẩu thất bại';
      });
  },
});

export const { clearDriverMessages } = driverSlice.actions;
export default driverSlice.reducer;
