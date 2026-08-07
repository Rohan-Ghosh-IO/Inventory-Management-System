import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authApi, LoginPayload, RegisterPayload } from '../../services/auth.api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Invalid email or password');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch user');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Authentication session invalid');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload as string;
    });

    // Get Current User
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
