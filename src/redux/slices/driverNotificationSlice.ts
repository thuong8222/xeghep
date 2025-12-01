import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from './driverSlice';

export interface NotificationItem {
    id: string;
    title: string;
    content: string;
    is_important: boolean;
    image: string | null;
    created_at: string;
}

interface NotificationPagination {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    unreadCount: number;
}

interface NotificationState {
    loading: boolean;
    loadingMore: boolean;
    refreshing: boolean;
    error: string | null;

    items: NotificationItem[];
    page: number;
    lastPage: number;
    unreadCount: number;
}

const initialState: NotificationState = {
    loading: false,
    loadingMore: false,
    refreshing: false,
    error: null,

    items: [],
    page: 1,
    lastPage: 1,
    unreadCount: 0,
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
        },
        setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
            state.items = action.payload;
          },
          
          addNotification: (state, action: PayloadAction<NotificationItem>) => {
            // Add to beginning of array (newest first)
            const exists = state.items.find(n => n.id === action.payload.id);
            
            if (!exists) {
              state.items.unshift(action.payload);
              state.unreadCount += 1;
            } else {
              // Update existing notification
              const index = state.items.findIndex(n => n.id === action.payload.id);
              if (index !== -1) {
                state.items[index] = action.payload;
              }
            }
          },
          
          removeNotification: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(n => n.id !== action.payload);
          },
          
          markAsRead: (state, action: PayloadAction<string>) => {
            // You can extend this to track read status per notification
            if (state.unreadCount > 0) {
              state.unreadCount -= 1;
            }
          },
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

export const {  resetNotifications, 
    setNotifications,
    addNotification,
    removeNotification,
    markAsRead,  } = driverNotificationSlice.actions;

export default driverNotificationSlice.reducer;
