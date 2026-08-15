import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const fetchTaxConfig = createAsyncThunk(
    'tax/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/tax');
            return data.tax;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch tax configuration');
        }
    }
);

export const updateTaxConfig = createAsyncThunk(
    'tax/update',
    async (taxData, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/admin/tax', taxData);
            return data.tax;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update tax configuration');
        }
    }
);

const taxSlice = createSlice({
    name: 'tax',
    initialState: {
        config: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tax config
            .addCase(fetchTaxConfig.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaxConfig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.config = action.payload;
            })
            .addCase(fetchTaxConfig.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update tax config
            .addCase(updateTaxConfig.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTaxConfig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.config = action.payload;
            })
            .addCase(updateTaxConfig.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = taxSlice.actions;
export default taxSlice.reducer;
