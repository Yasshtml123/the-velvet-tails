import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// User: Request return for an order
export const requestReturn = createAsyncThunk(
    'returns/requestReturn',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/orders/${orderId}/return`, { reason });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to submit return request');
        }
    }
);

// Admin: Fetch all return requests
export const fetchReturns = createAsyncThunk(
    'returns/fetchReturns',
    async ({ status } = {}, { rejectWithValue }) => {
        try {
            const params = status ? `?status=${status}` : '';
            const { data } = await api.get(`/admin/returns${params}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch returns');
        }
    }
);

// Admin: Get return count
export const fetchReturnsCount = createAsyncThunk(
    'returns/fetchReturnsCount',
    async ({ status = 'requested' } = {}, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/returns/count?status=${status}`);
            return data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch return count');
        }
    }
);

// Admin: Approve return
export const approveReturn = createAsyncThunk(
    'returns/approveReturn',
    async ({ orderId, adminNotes }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/returns/${orderId}/approve`, { adminNotes });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to approve return');
        }
    }
);

// Admin: Reject return
export const rejectReturn = createAsyncThunk(
    'returns/rejectReturn',
    async ({ orderId, adminNotes }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/returns/${orderId}/reject`, { adminNotes });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to reject return');
        }
    }
);

// Admin: Complete return
export const completeReturn = createAsyncThunk(
    'returns/completeReturn',
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/returns/${orderId}/complete`, {});
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to complete return');
        }
    }
);

const returnsSlice = createSlice({
    name: 'returns',
    initialState: {
        returns: [],
        count: 0,
        isLoading: false,
        error: null,
        success: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Request Return
            .addCase(requestReturn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(requestReturn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
            })
            .addCase(requestReturn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Returns
            .addCase(fetchReturns.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchReturns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.returns = action.payload.returns;
                state.count = action.payload.count;
            })
            .addCase(fetchReturns.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Count
            .addCase(fetchReturnsCount.fulfilled, (state, action) => {
                state.count = action.payload;
            })
            // Approve Return
            .addCase(approveReturn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveReturn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                // Update the return in the list
                const index = state.returns.findIndex(r => r._id === action.payload.order._id);
                if (index !== -1) {
                    state.returns[index] = action.payload.order;
                }
            })
            .addCase(approveReturn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Reject Return
            .addCase(rejectReturn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(rejectReturn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                const index = state.returns.findIndex(r => r._id === action.payload.order._id);
                if (index !== -1) {
                    state.returns[index] = action.payload.order;
                }
            })
            .addCase(rejectReturn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Complete Return
            .addCase(completeReturn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(completeReturn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                const index = state.returns.findIndex(r => r._id === action.payload.order._id);
                if (index !== -1) {
                    state.returns[index] = action.payload.order;
                }
            })
            .addCase(completeReturn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess } = returnsSlice.actions;
export default returnsSlice.reducer;
