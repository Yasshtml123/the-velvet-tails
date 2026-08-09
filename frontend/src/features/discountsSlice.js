import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Use public endpoint to fetch active discounts
            const { data } = await api.get('/discounts');
            return data.discounts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch discounts');
        }
    }
);

export const fetchDiscountById = createAsyncThunk(
    'discounts/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/discounts/${id}`);
            return data.discount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch discount');
        }
    }
);

export const createDiscount = createAsyncThunk(
    'discounts/create',
    async (discountData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/admin/discounts', discountData);
            return data.discount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create discount');
        }
    }
);

export const updateDiscount = createAsyncThunk(
    'discounts/update',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/discounts/${id}`, updates);
            return data.discount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update discount');
        }
    }
);

export const deleteDiscount = createAsyncThunk(
    'discounts/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/discounts/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete discount');
        }
    }
);

const discountsSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        currentDiscount: null,
        isLoading: false,
        hasFetched: false,
        error: null
    },
    reducers: {
        clearCurrentDiscount: (state) => {
            state.currentDiscount = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all discounts
            .addCase(fetchDiscounts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasFetched = true;
                state.discounts = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.isLoading = false;
                state.hasFetched = true;
                state.error = action.payload;
            })
            // Fetch discount by ID
            .addCase(fetchDiscountById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDiscountById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentDiscount = action.payload;
            })
            .addCase(fetchDiscountById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create discount
            .addCase(createDiscount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createDiscount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.discounts.unshift(action.payload);
            })
            .addCase(createDiscount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update discount
            .addCase(updateDiscount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.discounts.findIndex(d => d._id === action.payload._id);
                if (index !== -1) {
                    state.discounts[index] = action.payload;
                }
                state.currentDiscount = action.payload;
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete discount
            .addCase(deleteDiscount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.discounts = state.discounts.filter(d => d._id !== action.payload);
            })
            .addCase(deleteDiscount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentDiscount, clearError } = discountsSlice.actions;
export default discountsSlice.reducer;
