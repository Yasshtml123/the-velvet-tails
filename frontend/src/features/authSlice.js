import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api.js';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return data; // { message, requiresVerification }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      // data = { user: { _id, name, email, role }, accessToken }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      const payload = error.response?.data;
      if (payload?.requiresVerification) {
        return rejectWithValue({
          message: payload.error,
          requiresVerification: true,
          email: credentials.email
        });
      }
      return rejectWithValue(
        payload?.error || error.message || 'Login failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (_err) {
      // Even on network error, clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
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

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  isInitialized: false,
  // Email verification states
  registrationSuccess: false,
  registrationMessage: '',
  requiresVerification: false,
  verificationEmail: ''
};

// ── Slice ─────────────────────────────────────────────────────────────────────

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
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
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
        if (action.payload.requiresVerification) {
          state.registrationSuccess = true;
          state.registrationMessage = action.payload.message;
          state.isAuthenticated = false;
          state.user = null;
        } else {
          // Direct registration — user must still log in
          state.registrationSuccess = true;
          state.registrationMessage = action.payload.message || 'Registration successful! You can now log in.';
          state.isAuthenticated = false;
          state.user = null;
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
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
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
        state.isInitialized = true;
        state.error = null;
        state.requiresVerification = false;
        state.verificationEmail = '';
        state.registrationSuccess = false;
        state.registrationMessage = '';
      })
      .addCase(logout.rejected, (state) => {
        // Even if the thunk errors, storage was already cleared — mirror state
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = null;
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
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
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
