// redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppConfig from '../../services/config';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Axios instance
const api = axios.create({
  baseURL: AppConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// ---- REGISTER ----
export const registerUser = createAsyncThunk<
  string,
  {
    full_name: string;
    phone: string;
    password: string;
    confirm_password: string;
    area: string;
  },
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/register', payload);
    console.log(response, 'register');
    return response.data.message || 'Đăng ký thành công';
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Đăng ký thất bại',
    );
  }
});

// ---- LOGIN ----
export const loginUser = createAsyncThunk<
  { token: string; successMessage: string }, // ✅ kiểu trả về
  { phone: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/login', payload);
    console.log('response login: ', response);
    console.log('response login  message: ', response.data.message);

    const token = response.data.data.token;
    const successMessage = response.data.message || 'Đăng nhập thành công'; // ✅ lấy message
    await AsyncStorage.setItem('token', token);
    return { token, successMessage };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Đăng nhập thất bại',
    );
  }
});

// ---- FORGOT PASSWORD ----
export const forgotPassword = createAsyncThunk<
  string,
  { phone: string },
  { rejectValue: string }
>('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/auth/forgot-password', payload);
    return response.data.message || 'Yêu cầu thành công';
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Yêu cầu thất bại',
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      AsyncStorage.removeItem('token');
    },
    clearMessages: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      // REGISTER
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng ký thất bại';
      })

      // LOGIN
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{ token: string; successMessage: string }>,
        ) => {
          state.loading = false;
          state.token = action.payload.token;
          state.successMessage = action.payload.successMessage;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        },
      )
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Yêu cầu thất bại';
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
