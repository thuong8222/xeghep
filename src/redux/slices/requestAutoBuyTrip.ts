import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../data/API';

// =======================
// 1. Tạo yêu cầu mua chuyến
// =======================
export const createAutoBuy = createAsyncThunk(
  'autoBuy/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('api/autoBuy/create', payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// =======================
// 2. Lấy danh sách yêu cầu
// =======================
export const fetchAutoBuyList = createAsyncThunk(
  'autoBuy/list',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('api/autoBuy/list_request');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// =======================
// 3. Chi tiết một yêu cầu
// =======================
export const fetchAutoBuyDetail = createAsyncThunk(
  'autoBuy/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`api/autoBuy/detail/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// =======================
// 4. Cập nhật yêu cầu
// =======================
export const updateAutoBuy = createAsyncThunk(
  'autoBuy/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.put(`api/autoBuy/update/${id}`, data);
      return res.data.data;
    } catch (err: any) {
      console.log('update err; ', err);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
// =======================
// 4. Huỷ yêu cầu
// =======================
export const cancelAutoBuyTrip = createAsyncThunk(
  'autoBuy/cancel',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await api.post(`api/autoBuy/cancel/${id}`);

      // ✅ CHỦ ĐỘNG TRẢ ID
      return { id };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);


// =======================
// Slice
// =======================
const requestAutoBuySlice = createSlice({
  name: 'autoBuy',
  initialState: {
    list: [],
    detail: null,
    loading: false,
    error: null,
    lastUpdate: null,
  },
  reducers: {
    // ✅ Thêm reducer để update realtime
    updateAutoBuyItem: (state, action) => {
      const updatedItem = action.payload;
      const index = state.list.findIndex(item => item.id === updatedItem.id);

      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedItem };
      }

      state.lastUpdate = Date.now();
    },

    // ✅ Thêm item mới vào list
    addAutoBuyItem: (state, action) => {
      const newItem = action.payload;
      const exists = state.list.some(item => item.id === newItem.id);

      if (!exists) {
        state.list.unshift(newItem); // Thêm vào đầu list
      }

      state.lastUpdate = Date.now();
    },

    // ✅ Xóa item khỏi list
    removeAutoBuyItem: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter(item => item.id !== id);
      state.lastUpdate = Date.now();
    },

    // ✅ Clear error
    clearError: state => {
      state.error = null;
    },

    // ✅ Reset state
    resetAutoBuy: () => initialState,
  },
  extraReducers: builder => {
    // Create
    builder
      .addCase(createAutoBuy.pending, state => {
        state.loading = true;
      })
      .addCase(createAutoBuy.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createAutoBuy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // List
    builder
      .addCase(fetchAutoBuyList.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAutoBuyList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAutoBuyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Detail
    builder
      .addCase(fetchAutoBuyDetail.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAutoBuyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchAutoBuyDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateAutoBuy.pending, state => {
        state.loading = true;
      })
      .addCase(updateAutoBuy.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(updateAutoBuy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //cancelAutoBuyTrip
    builder
      .addCase(cancelAutoBuyTrip.pending, state => {
        state.loading = true;
      })
      .addCase(cancelAutoBuyTrip.fulfilled, (state, action) => {
        state.loading = false;
      
        const { id } = action.payload;
      
        // ✅ XÓA KHỎI LIST
        state.list = state.list.filter(item => item.id !== id);
      
        // nếu đang xem detail
        if (state.detail?.id === id) {
          state.detail = null;
        }
      
        state.lastUpdate = Date.now();
      })
      
      .addCase(cancelAutoBuyTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {
  updateAutoBuyItem,
  addAutoBuyItem,
  removeAutoBuyItem,
  clearError,
  resetAutoBuy,
} = requestAutoBuySlice.actions;
export default requestAutoBuySlice.reducer;
