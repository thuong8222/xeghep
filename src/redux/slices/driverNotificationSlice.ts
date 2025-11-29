import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from './driverSlice';

export interface NotificationItem {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

interface NotificationPagination {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
}

interface NotificationState {
    loading: boolean;
    loadingMore: boolean;
    refreshing: boolean;
    error: string | null;

    items: NotificationItem[];
    page: number;
    lastPage: number;
}

const initialState: NotificationState = {
    loading: false,
    loadingMore: false,
    refreshing: false,
    error: null,

    items: [],
    page: 1,
    lastPage: 1,
};

// =======================
//  API Call
// =======================
export const fetchDriverNotifications = createAsyncThunk(
    'driver/fetchNotifications',
    async (page: number, thunkAPI) => {
        try {
            const res = await api.get(`/api/driver/notifications?page=${page}`);
            return res.data.data as NotificationPagination;
        } catch (err: any) {
            return thunkAPI.rejectWithValue('Không tải được thông báo');
        }
    }
);

// =======================
//  Slice
// =======================
const driverNotificationSlice = createSlice({
    name: 'driverNotifications',
    initialState,
    reducers: {
        resetNotifications(state) {
            state.items = [];
            state.page = 1;
            state.lastPage = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load đầu tiên
            .addCase(fetchDriverNotifications.pending, (state, action) => {
                if (state.page === 1) state.loading = true;
                else state.loadingMore = true;
            })

            .addCase(fetchDriverNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.refreshing = false;

                const { data, current_page, last_page } = action.payload;

                if (current_page === 1) {
                    state.items = data; // refresh
                } else {
                    state.items = [...state.items, ...data]; // load more
                }

                state.page = current_page;
                state.lastPage = last_page;
            })

            .addCase(fetchDriverNotifications.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.refreshing = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetNotifications } = driverNotificationSlice.actions;

export default driverNotificationSlice.reducer;
