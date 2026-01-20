// redux/slices/areaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointerType } from 'react-native-gesture-handler';
import {
  buyPoint,
  cancelSalePointAPI,
  confirmPoint,
  createSale,
  getHistoryTrandsactionPoints,
  getPoints,
  historyPointAPI,
  pauselSalePointAPI,
  pauseSalePointAPI,
  resumeSalePointAPI,
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
  page: number;
  lastPage: number;
  types: string[];
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
  page: 1,
  lastPage: 1,
  types: [],
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
//historyPointAPI
export const historyPoint = createAsyncThunk<
  Point[],
  void,
  { rejectValue: string }
>('point/historyPoint', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get('api/points');
    const response = await historyPointAPI();
    console.log('historyPoint: ', response.data.data);
    if (response.data.status === 1) {
      return response.data.data;
    } else {
      return rejectWithValue(
        response.data.message || 'Lấy danh sách điểm thất bại',
      );
    }
  } catch (err: any) {
    console.log('historyPoint err: ', err);
    return rejectWithValue(
      err.response?.data?.message || 'Lấy danh sách điểm thất bại',
    );
  }
});
//points-for-sale/{id}/cancel'
export const cancelSalePoint = createAsyncThunk<
  any, // trả về data từ API
  { id: string },
  { rejectValue: string }
>('point/cancelSalePoint', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    const response = await cancelSalePointAPI(id);
    console.log('point/cancelSalePoint mua diem: ', response);
    if (response.data.status === 1) {
      dispatch(fetchPointsOnSale()); // refresh danh sách
      return response.data;
    } else {
      return rejectWithValue(response.data.message || 'Huỷ bán điểm thất bại');
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Huỷ bán điểm thất bại');
  }
});
export const pauseSalePoint = createAsyncThunk<
  any, // trả về data từ API
  { id: string },
  { rejectValue: string }
>('point/pauseSalePoint', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    console.log('pauseSalePoint id: ',id)
    const response = await pauseSalePointAPI(id);
    console.log('point/pauseSalePoint mua diem: ', response);
    if (response.data.status === 1) {
      dispatch(fetchPointsOnSale()); // refresh danh sách
      return response.data;
    } else {
      return rejectWithValue(response.data.message || 'Huỷ bán điểm thất bại');
    }
  } catch (err: any) {
    console.log('err: ',err)
    return rejectWithValue(err.response?.data?.message || 'Huỷ bán điểm thất bại');
  }
});
export const resumeSalePoint = createAsyncThunk<
  any, // trả về data từ API
  { id: string },
  { rejectValue: string }
>('point/resumeSalePoint', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    const response = await resumeSalePointAPI(id);
    console.log('point/resumeSalePoint mua diem: ', response);
    if (response.data.status === 1) {
      dispatch(fetchPointsOnSale()); // refresh danh sách
      return response.data;
    } else {
      return rejectWithValue(response.data.message || 'Huỷ bán điểm thất bại');
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Huỷ bán điểm thất bại');
  }
});
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

// 4️⃣ Lấy lịch sử giao dịch điểm với filter + phân trang
// redux/slices/pointSlice.ts

export interface FetchHistoryPointParams {
  start_date?: number; // timestamp giây
  end_date?: number; // timestamp giây
  page?: number;
  related_type?: string;
}
export const fetchPointHistory = createAsyncThunk<
  { data: any[]; lastPage: number }, // trả về data + lastPage
  FetchHistoryPointParams,
  { rejectValue: string }
>('point/fetchPointHistory', async (params, { rejectWithValue }) => {
  try {
 
    const response = await getHistoryTrandsactionPoints(params); // API hỗ trợ query params
    if (response.data.status === true) {
      return {
        data: response.data.data, // giả sử API trả về { items: [...], last_page: n }
        lastPage: response.data.data.last_page || 1,
        types: response.data.types || [],
      };
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
      //historyPoint
      .addCase(historyPoint.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        historyPoint.fulfilled,
        (state, action: PayloadAction<Point[]>) => {
          state.loading = false;
          state.history = action.payload;
          state.successMessage = 'Lấy lịch sử mua / bán điểm thành công';
        },
      )
      .addCase(historyPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy danh sách điểm đang bán thất bại';
      })
      ///cancelSalePoint
      .addCase(cancelSalePoint.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(cancelSalePoint.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Huỷ bán điểm thành công';
      })
      .addCase(cancelSalePoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Huỷ bán điểm thất bại';
      })
     //pauseSalePoint
     .addCase(pauseSalePoint.pending, state => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    })
    .addCase(pauseSalePoint.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = 'Tạm dừng bán điểm này';
    })
    .addCase(pauseSalePoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Tạm dừng bán điểm thất bại';
    })
    // resumeSalePoint
    .addCase(resumeSalePoint.pending, state => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    })
    .addCase(resumeSalePoint.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = 'Bán lại điểm này thành công';
    })
    .addCase(resumeSalePoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Bán lại điểm này thất bại';
    })
    //
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
      .addCase(fetchPointHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.meta.arg.page || 1;
        state.lastPage = action.payload.lastPage;
        if (state.page > 1) {
          state.history = [...state.history, ...action.payload.data]; // load more
        } else {
          state.history = action.payload.data;
        }
        state.types = action.payload.types || [];
      })
      .addCase(fetchPointHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lấy lịch sử giao dịch thất bại';
      });
  },
});

export const {
  addTransaction,
  addPoint,
  updatePoint,
  removePoint,
  clearPointMessages,
} = pointSlice.actions;
export default pointSlice.reducer;
