import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/orders', orderData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create order');
        }
    }
);

export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async (status = null, { rejectWithValue }) => {
        try {
            const url = status ? `/orders?status=${status}` : '/orders';
            const { data } = await api.get(url);
            return data.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
        }
    }
);

export const trackOrder = createAsyncThunk(
    'orders/track',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/orders/${orderId}/track`);
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to track order');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/orders/${orderId}/cancel`, { reason });
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to cancel order');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload.order;
                state.orders.unshift(action.payload.order);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Track order
            .addCase(trackOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(trackOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(trackOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
