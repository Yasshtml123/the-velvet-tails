import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('q', search);
      params.append('limit', limit);

      const { data } = await api.get(`/products?${params}`);
      return data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Product not found');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories');
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

// Admin thunks
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
    }
  }
);

const initialState = {
  items: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    search: ''
  }
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update product
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      });

    // Delete product
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  }
});

export const { setFilters, clearCurrentProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
