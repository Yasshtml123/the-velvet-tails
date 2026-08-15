import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const initiatePayment = createAsyncThunk(
    'payments/initiate',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/payments/${orderId}/initiate`);
            return data.paymentData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to initiate payment');
        }
    }
);

export const checkPaymentStatus = createAsyncThunk(
    'payments/checkStatus',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/payments/${orderId}/status`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to check payment status');
        }
    }
);

const paymentsSlice = createSlice({
    name: 'payments',
    initialState: {
        paymentData: null,
        paymentStatus: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearPaymentData: (state) => {
            state.paymentData = null;
            state.paymentStatus = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Initiate payment
            .addCase(initiatePayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentData = action.payload;
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Check payment status
            .addCase(checkPaymentStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkPaymentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentStatus = action.payload;
            })
            .addCase(checkPaymentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearPaymentData, clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
