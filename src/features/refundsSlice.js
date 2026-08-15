import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const fetchRefunds = createAsyncThunk(
    'refunds/fetchRefunds',
    async ({ status = 'requested' } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (status) params.append('status', status);

            const { data } = await api.get(`/admin/refunds?${params.toString()}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch refunds');
        }
    }
);

// Lightweight count fetch for badge (doesn't store refunds)
export const fetchRefundCount = createAsyncThunk(
    'refunds/fetchRefundCount',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/refunds/count?status=requested');
            return data.count; // Only return the count
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch refund count');
        }
    }
);

export const approveRefund = createAsyncThunk(
    'refunds/approveRefund',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/refunds/${orderId}/approve`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to approve refund');
        }
    }
);

export const rejectRefund = createAsyncThunk(
    'refunds/rejectRefund',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/refunds/${orderId}/reject`, { reason });
            return { ...data, orderId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to reject refund');
        }
    }
);

const refundsSlice = createSlice({
    name: 'refunds',
    initialState: {
        refunds: [],
        pendingCount: 0,
        isLoading: false,
        error: null,
        currentFilter: 'requested'
    },
    reducers: {
        setFilter: (state, action) => {
            state.currentFilter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch refunds
        builder
            .addCase(fetchRefunds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRefunds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.refunds = action.payload.refunds;
            })
            .addCase(fetchRefunds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Approve refund
            .addCase(approveRefund.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(approveRefund.fulfilled, (state, action) => {
                state.isLoading = false;
                // Remove from list or update status
                state.refunds = state.refunds.filter(r => r._id !== action.payload.orderId);
            })
            .addCase(approveRefund.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Reject refund
            .addCase(rejectRefund.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(rejectRefund.fulfilled, (state, action) => {
                state.isLoading = false;
                // Remove from list
                state.refunds = state.refunds.filter(r => r._id !== action.payload.orderId);
            })
            .addCase(rejectRefund.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch refund count (for badge)
            .addCase(fetchRefundCount.fulfilled, (state, action) => {
                state.pendingCount = action.payload;
            });
    }
});

export const { setFilter, clearError } = refundsSlice.actions;
export default refundsSlice.reducer;
