import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../data/API";


// =======================
// 1. Tạo yêu cầu mua chuyến
// =======================
export const createAutoBuy = createAsyncThunk(
  "autoBuy/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("api/autoBuy/create", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// 2. Lấy danh sách yêu cầu
// =======================
export const fetchAutoBuyList = createAsyncThunk(
  "autoBuy/list",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("api/autoBuy/list_request");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// 3. Chi tiết một yêu cầu
// =======================
export const fetchAutoBuyDetail = createAsyncThunk(
  "autoBuy/detail",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`api/autoBuy/detail/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// 4. Cập nhật yêu cầu
// =======================
export const updateAutoBuy = createAsyncThunk(
  "autoBuy/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.put(`api/autoBuy/update/${id}`, data);
      return res.data.data;
    } catch (err: any) {
        console.log('update err; ', err)
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// Slice
// =======================
const requestAutoBuySlice = createSlice({
  name: "autoBuy",
  initialState: {
    list: [],
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createAutoBuy.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAutoBuy.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAutoBuy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // List
    builder
      .addCase(fetchAutoBuyList.pending, (state) => {
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
      .addCase(fetchAutoBuyDetail.pending, (state) => {
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
      .addCase(updateAutoBuy.pending, (state) => {
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
  },
});

export default requestAutoBuySlice.reducer;
