import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      // New flow: registration returns a message, not a user (requires email verification)
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      return data;
    } catch (error) {
      // Check if requires verification
      if (error.response?.data?.requiresVerification) {
        return rejectWithValue({
          message: error.response.data.error,
          requiresVerification: true,
          email: error.response.data.email
        });
      }
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resend verification email');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  // Email verification states
  registrationSuccess: false,
  registrationMessage: '',
  requiresVerification: false,
  verificationEmail: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.requiresVerification = false;
      state.verificationEmail = '';
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    clearRegistrationState: (state) => {
      state.registrationSuccess = false;
      state.registrationMessage = '';
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      if (action.payload.accessToken) {
        localStorage.setItem('accessToken', action.payload.accessToken);
      }
    }
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
        state.registrationMessage = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        // New: registration requires verification
        if (action.payload.requiresVerification) {
          state.registrationSuccess = true;
          state.registrationMessage = action.payload.message;
          state.isAuthenticated = false;
          state.user = null;
        } else {
          // Direct login (for backward compatibility)
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.isInitialized = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.requiresVerification = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload?.requiresVerification) {
          state.error = action.payload.message;
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        } else {
          state.error = action.payload;
        }
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true;
      });

    // Resend verification
    builder
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationMessage = action.payload.message;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setInitialized, clearRegistrationState, setCredentials } = authSlice.actions;
export default authSlice.reducer;
