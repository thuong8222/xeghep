import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AppConfig from '../../services/config';

interface TermsState {
  termsData: any | null;
  privacyData: any | null;
  loadingTerms: boolean;
  loadingPrivacy: boolean;
  errorTerms: string | null;
  errorPrivacy: string | null;
}

const initialState: TermsState = {
  termsData: null,
  privacyData: null,
  loadingTerms: false,
  loadingPrivacy: false,
  errorTerms: null,
  errorPrivacy: null,
};

// Async thunk để call API Terms
export const fetchTerms = createAsyncThunk('terms/fetchTerms', async () => {
  const response = await axios.get(`${AppConfig.BASE_URL}api/policies/terms`);
  return response.data.data;
});

// Async thunk để call API Privacy
export const fetchPrivacy = createAsyncThunk('terms/fetchPrivacy', async () => {
  const response = await axios.get(`${AppConfig.BASE_URL}api/policies/privacy`);
  return response.data.data;
});

const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Terms
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.loadingTerms = true;
        state.errorTerms = null;
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.loadingTerms = false;
        state.termsData = action.payload;
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.loadingTerms = false;
        state.errorTerms = action.error.message || 'Failed to fetch terms';
      });

    // Privacy
    builder
      .addCase(fetchPrivacy.pending, (state) => {
        state.loadingPrivacy = true;
        state.errorPrivacy = null;
      })
      .addCase(fetchPrivacy.fulfilled, (state, action) => {
        state.loadingPrivacy = false;
        state.privacyData = action.payload;
      })
      .addCase(fetchPrivacy.rejected, (state, action) => {
        state.loadingPrivacy = false;
        state.errorPrivacy = action.error.message || 'Failed to fetch privacy';
      });
  },
});

export default termsSlice.reducer;
