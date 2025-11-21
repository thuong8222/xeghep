// src/redux/regulationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from './driverSlice';

// src/types.ts
export interface Regulation {
  id: string;
  title: string;
  description: string;
  point: number;
  is_active: boolean;
}

export interface RegulationCategory {
  id: string;
  name: string;
  description: string;
  regulations?: Regulation[];
}

export interface RegulationsState {
  categories: RegulationCategory[];
  loading: boolean;
  error: string | null;
}

export const fetchRegulationsByArea = createAsyncThunk<
  RegulationCategory[], // return type
  string, // area_id
  { rejectValue: { message: string } }
>('regulations/fetchByArea', async (area_id, { rejectWithValue }) => {
  try {
    const response = await api.get<RegulationCategory[]>(
      `api/areas/${area_id}/regulation_with_categories`,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue({
      message: err.response?.data?.message || err.message,
    });
  }
});

const initialState: RegulationsState = {
  categories: [],
  loading: false,
  error: null,
};

const regulationSlice = createSlice({
  name: 'regulations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRegulationsByArea.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRegulationsByArea.fulfilled,
        (state, action: PayloadAction<RegulationCategory[]>) => {
          state.loading = false;
          state.categories = action.payload;
        },
      )
      .addCase(fetchRegulationsByArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default regulationSlice.reducer;
