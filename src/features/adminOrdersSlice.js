import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Fetch order count (lightweight for polling)
export const fetchOrderCount = createAsyncThunk(
    'adminOrders/fetchOrderCount',
    async (status = 'confirmed', { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/orders/count', {
                params: { status }
            });
            return data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch order count');
        }
    }
);

// Async thunks
export const fetchAdminOrders = createAsyncThunk(
    'adminOrders/fetchAll',
    async ({ status, paymentStatus, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (paymentStatus) params.append('paymentStatus', paymentStatus);
            params.append('page', page);
            params.append('limit', limit);

            const { data } = await api.get(`/admin/orders?${params.toString()}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
        }
    }
);

export const fetchAdminOrderById = createAsyncThunk(
    'adminOrders/fetchById',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/orders/${orderId}`);
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch order');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'adminOrders/updateStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update order status');
        }
    }
);

export const shipOrder = createAsyncThunk(
    'adminOrders/shipOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/admin/orders/${orderId}/ship`);
            return data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to ship order');
        }
    }
);

const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    initialState: {
        orders: [],
        currentOrder: null,
        pendingOrderCount: 0,
        pagination: {
            page: 1,
            limit: 20,
            total: 0
        },
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
            // Fetch order count
            .addCase(fetchOrderCount.fulfilled, (state, action) => {
                state.pendingOrderCount = action.payload;
            })
            // Fetch admin orders
            .addCase(fetchAdminOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total
                };
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch order by ID
            .addCase(fetchAdminOrderById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchAdminOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Ship order
            .addCase(shipOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(shipOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(shipOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentOrder, clearError } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
