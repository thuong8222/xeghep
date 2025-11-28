// redux/slices/areaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointerType } from 'react-native-gesture-handler';
import {
  buyPoint,
  confirmPoint,
  createSale,
  getHistoryTrandsactionPoints,
  getPoints,
  uploadTransferProof,
} from '../data/API';

// ---- INTERFACE ----
export interface Point {
  id: string;
  name: string;
  province_code: string;
  code: string;
  description: string;
  is_active: number;
  created_at?: string | null;
  updated_at?: string | null;
}

interface PointState {
  points: Point[];
  history: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
interface BuyPointPayload {
  points_amount: number;
  price_per_point: number;
  confirm_password?: string;
}

interface UploadProofPayload {
  formData: FormData;
}
const initialState: PointState = {
  points: [],
  loading: false,
  history: [],
  error: null,
  successMessage: null,
};
interface BankInfo {
  bank_name: string;
  account_number: string;
  account_name: string;
}

interface CreateSalePayload {
  points_amount: number;
  price_per_point: number;
  bank_info: BankInfo;
}

// ---- AXIOS INSTANCE ----
export const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- FETCH AREA GROUPS ----
export const fetchPointsOnSale = createAsyncThunk<
  Point[],
  void,
  { rejectValue: string }
>('point/fetchPointsOnSale', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get('api/points');
    const response = await getPoints();
    console.log('fetchPointsOnSale: ', response.data.data);
    if (response.data.status === 1) {
      return response.data.data;
    } else {
      return rejectWithValue(
        response.data.message || 'Lấy danh sách điểm thất bại',
      );
    }
  } catch (err: any) {
    console.log('fetchPointsOnSale err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy danh sách điểm thất bại',
    );
  }
});
// 1️⃣ Mua điểm
export const buyPointAction = createAsyncThunk<
  any, // trả về data từ API
  { id: string },
  { rejectValue: string }
>('point/buyPoint', async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const response = await buyPoint(id, data);
    console.log('point/buyPoint mua diem: ', response);
    if (response.data.status === 1) {
      dispatch(fetchPointsOnSale()); // refresh danh sách
      return response.data;
    } else {
      return rejectWithValue(response.data.message || 'Mua điểm thất bại');
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Mua điểm thất bại');
  }
});

// 2️⃣ Upload hình chuyển khoản
export const uploadTransferProofAction = createAsyncThunk<
  any,
  { id: string; formData: FormData },
  { rejectValue: string }
>(
  'point/uploadTransferProof',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await uploadTransferProof(id, formData);
      if (response.data.status === 1) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || 'Upload chứng từ thất bại',
        );
      }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Upload chứng từ thất bại',
      );
    }
  },
);

// 3️⃣ Xác nhận điểm
export const confirmPointAction = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>('point/confirmPoint', async (id, { rejectWithValue }) => {
  try {
    const response = await confirmPoint(id);
    if (response.data.status === 1) {
      return response.data;
    } else {
      return rejectWithValue(response.data.message || 'Xác nhận thất bại');
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Xác nhận thất bại');
  }
});

// 4️⃣ Lấy lịch sử giao dịch điểm
export const fetchPointHistory = createAsyncThunk<
  any[], // dữ liệu trả về là mảng các giao dịch
  void,
  { rejectValue: string }
>('point/fetchPointHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await getHistoryTrandsactionPoints();
    console.log('fetchPointHistory: ', response.data.data);
    console.log('fetchPointHistory: ', response.data);
    if (response.data.status === true) {
      return response.data.data; // trả về danh sách giao dịch
    } else {
      return rejectWithValue(response.data.message || 'Lấy lịch sử thất bại');
    }
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Lấy lịch sử thất bại',
    );
  }
});
export const createSalePoint = createAsyncThunk<
  string, // return type (response.data.data)
  CreateSalePayload, // payload type
  { rejectValue: string } // reject type
>('point/createSalePoint', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const response = await createSale(payload);

    if (response.data.status === 1) {
      dispatch(fetchPointsOnSale());
      return response.data;
    } else {
      return rejectWithValue(
        response.data.message || 'Lấy danh sách điểm thất bại',
      );
    }
  } catch (err: any) {
    console.log('createSalePoint err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy danh sách điểm thất bại',
    );
  }
});

// ---- SLICE ----
const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {
     // ✅ Thêm giao dịch mới
     addTransaction: (state, action: PayloadAction<any>) => {
      // Chỉ thêm nếu chưa tồn tại
      const exists = state.history.find(t => t.id === action.payload.id);
      if (!exists) {
        state.history.unshift(action.payload); // Thêm vào đầu
      }
    },
     // ✅ Thêm điểm mới
     addPoint: (state, action: PayloadAction<any>) => {
      // Chỉ thêm nếu chưa tồn tại
      const exists = state.points.find(p => p.id === action.payload.id);
      if (!exists) {
        state.points.unshift(action.payload); // Thêm vào đầu
      }
    },

    // ✅ Cập nhật điểm
    updatePoint: (state, action: PayloadAction<any>) => {
      const index = state.points.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.points[index] = action.payload;
      }
    },

    // ✅ Xóa điểm
    removePoint: (state, action: PayloadAction<string>) => {
      state.points = state.points.filter(p => p.id !== action.payload);
    },
    clearPointMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPointsOnSale.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        fetchPointsOnSale.fulfilled,
        (state, action: PayloadAction<Point[]>) => {
          state.loading = false;
          state.points = action.payload;
          state.successMessage = 'Lấy danh sách điểm đang bán thành công';
        },
      )
      .addCase(fetchPointsOnSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy danh sách điểm đang bán thất bại';
      })
      //tao moi point
      .addCase(createSalePoint.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        createSalePoint.fulfilled,
        (state, action: PayloadAction<Point[]>) => {
          state.loading = false;
          state.points = action.payload;
          state.successMessage = 'Đăng bán điểm thành công';
        },
      )
      .addCase(createSalePoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng bán điểm thất bại';
      })
      .addCase(buyPointAction.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(buyPointAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Mua điểm thành công';
      })
      .addCase(buyPointAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Mua điểm thất bại';
      })

      .addCase(uploadTransferProofAction.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadTransferProofAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Upload chứng từ thành công';
      })
      .addCase(uploadTransferProofAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload thất bại';
      })

      .addCase(confirmPointAction.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(confirmPointAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Xác nhận điểm thành công';
      })
      .addCase(confirmPointAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Xác nhận thất bại';
      })
      .addCase(fetchPointHistory.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        fetchPointHistory.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.history = action.payload;
          state.successMessage = 'Lấy lịch sử giao dịch thành công';
        },
      )
      .addCase(fetchPointHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy lịch sử giao dịch thất bại';
      });
  },
});

export const {addTransaction, addPoint, updatePoint, removePoint, clearPointMessages } = pointSlice.actions;
export default pointSlice.reducer;
