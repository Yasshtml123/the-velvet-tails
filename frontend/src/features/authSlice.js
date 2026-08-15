import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '@/config/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: userData.name });
      
      // Store user record in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString()
      });
      
      return { message: 'Registration successful! You can now log in.' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      
      const userObj = {
        _id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: 'user'
      };
      
      const token = await user.getIdToken();
      localStorage.setItem('accessToken', token);
      
      return { user: userObj, accessToken: token };
    } catch (error) {
      return rejectWithValue('Login failed: ' + error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } catch (error) {
      return rejectWithValue(error.message);
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
          if (action.payload.user) {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
          }
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
