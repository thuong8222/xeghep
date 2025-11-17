// redux/slices/areaSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from './tripsSlice';

interface AreaState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AreaState = {
  data: null,
  loading: false,
  error: null,
};

// ---- FETCH DRIVER TEAM MEMBERS ----
export interface DriverMember {
    id: string;
    full_name: string;
    phone: string;
    email?: string | null;
    area_id: string;
    is_active: number;
    created_at?: string | null;
    updated_at?: string | null;
  }
  
  interface FetchTeamPayload {
    area_id: string; // ID khu vực để lấy team
  }
  
  export const fetchAreaDriver = createAsyncThunk<
    DriverMember[],
    FetchTeamPayload,
    { rejectValue: string }
  >(
    'trips/fetchDriverTeam',
    async (payload, { rejectWithValue }) => {
      try {
        const response = await api.get('api/areas/driver', {
          params: { area_id: payload.area_id },
        });
  
  
   
        return  response.data.data.drivers; 
      } catch (err: any) {
        console.log('err fetch driver team: ', err);
        return rejectWithValue(err.response?.data?.message || 'Lấy danh sách thành viên nhóm thất bại');
      }
    }
  );
  

const memberGroupSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreaDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreaDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAreaDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default memberGroupSlice.reducer;
