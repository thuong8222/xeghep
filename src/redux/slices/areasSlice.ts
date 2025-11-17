// redux/slices/areaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- INTERFACE ----
export interface AreaGroup {
  id: string;
  name: string;
  province_code: string;
  code: string;
  description: string;
  is_active: number;
  created_at?: string | null;
  updated_at?: string | null;
}

interface AreaState {
  groups: AreaGroup[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AreaState = {
  groups: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ---- AXIOS INSTANCE ----
export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- FETCH AREA GROUPS ----
export const fetchAreaGroups = createAsyncThunk<
  AreaGroup[],
  void,
  { rejectValue: string }
>(
  'area/fetchAreaGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/areas/group');
      if (response.data.status === 1) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Lấy danh sách khu vực thất bại');
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lấy danh sách khu vực thất bại');
    }
  }
);

// ---- SLICE ----
const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    clearAreaMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreaGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAreaGroups.fulfilled, (state, action: PayloadAction<AreaGroup[]>) => {
        state.loading = false;
        state.groups = action.payload;
        state.successMessage = 'Lấy danh sách khu vực thành công';
      })
      .addCase(fetchAreaGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy danh sách khu vực thất bại';
      });
  },
});

export const { clearAreaMessages } = areaSlice.actions;
export default areaSlice.reducer;
