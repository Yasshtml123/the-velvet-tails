/**
 * productsSlice.js
 *
 * All product data is now served from the static local catalog
 * (src/data/products.js) — no backend API calls, no network errors on Vercel.
 *
 * Public API is 100% identical to the previous version:
 *   - fetchProducts({ category, search })
 *   - fetchProductById(idOrSlug)
 *   - fetchCategories()
 *   - createProduct / updateProduct / deleteProduct  (admin, no-ops in static mode)
 *   - setFilters / clearCurrentProduct / clearError  (reducers)
 *
 * Components that consume `items`, `categories`, `isLoading`, `error`,
 * `currentProduct`, and `filters` from the Redux store work without change.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTS, CATEGORIES, filterProducts, findProduct } from '@/data/products.js';

// ─── Public thunks ─────────────────────────────────────────────────────────────

/**
 * Returns all products matching optional { category, search } filters.
 * Resolves synchronously — no network latency, no error possible.
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search } = {}) => {
    return filterProducts({ category, search });
  }
);

/**
 * Returns a single product by _id or slug.
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (idOrSlug, { rejectWithValue }) => {
    const product = findProduct(idOrSlug);
    if (!product) return rejectWithValue('Product not found');
    return product;
  }
);

/**
 * Returns the list of distinct category strings.
 */
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => CATEGORIES
);

// ─── Admin thunks (static-mode stubs) ─────────────────────────────────────────
// These keep the same action names so admin panels compile without changes.
// In static mode they simply log a warning and resolve with the input.

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    console.warn('[Static mode] createProduct is a no-op. Connect to the backend to persist products.');
    return rejectWithValue('Product creation requires backend connection.');
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    console.warn('[Static mode] updateProduct is a no-op.');
    return rejectWithValue('Product updates require backend connection.');
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    console.warn('[Static mode] deleteProduct is a no-op.');
    return rejectWithValue('Product deletion requires backend connection.');
  }
);

// ─── Initial state ─────────────────────────────────────────────────────────────

const initialState = {
  items: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    search: '',
  },
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

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
    },
  },
  extraReducers: (builder) => {
    // ── fetchProducts ───────────────────────────────────────────────────────
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
        state.error = action.payload ?? action.error.message;
      });

    // ── fetchProductById ────────────────────────────────────────────────────
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
        state.error = action.payload ?? action.error.message;
      });

    // ── fetchCategories ─────────────────────────────────────────────────────
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // ── Admin stubs (no-op in static mode) ──────────────────────────────────
    builder
      .addCase(createProduct.pending,  (state) => { state.isLoading = true;  state.error = null; })
      .addCase(createProduct.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(updateProduct.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteProduct.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { setFilters, clearCurrentProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
