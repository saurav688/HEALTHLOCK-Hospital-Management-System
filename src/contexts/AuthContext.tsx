import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_BASE } from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin' | 'staff';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_TOKENS'; payload: { accessToken: string; refreshToken: string } };

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string; data?: any }>;
  loginWithGoogle: (idToken: string, phone?: string) => Promise<{ success: boolean; message?: string; data?: any }>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; message?: string; data?: any }>;
  verifyPhoneLogin: (phone: string, otp: string) => Promise<{ success: boolean; message?: string; data?: any }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string; data?: any }>;
  logout: () => void;
  verifyEmail: (otp: string) => Promise<{ success: boolean; message?: string }>;
  verifyPhone: (otp: string) => Promise<{ success: boolean; message?: string }>;
  resendEmailOTP: () => Promise<{ success: boolean; message?: string }>;
  resendPhoneOTP: () => Promise<{ success: boolean; message?: string }>;
  refreshAccessToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: 'patient' | 'doctor' | 'admin' | 'staff';
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load tokens from localStorage on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          // Verify token and get user data
          const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: result.data.user,
                accessToken,
                refreshToken,
              },
            });
          } else if (response.status === 401) {
            // Try to refresh token
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              // Clear invalid tokens
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadStoredAuth();
  }, []);

  // Save tokens to localStorage whenever they change
  useEffect(() => {
    if (state.accessToken && state.refreshToken) {
      localStorage.setItem('accessToken', state.accessToken);
      localStorage.setItem('refreshToken', state.refreshToken);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, [state.accessToken, state.refreshToken]);

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (state.accessToken) {
      headers['Authorization'] = `Bearer ${state.accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired, try to refresh
    if (response.status === 401 && state.refreshToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed && state.accessToken) {
        headers['Authorization'] = `Bearer ${state.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    return response;
  };

  const login = async (identifier: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
            accessToken: result.data.tokens.accessToken,
            refreshToken: result.data.tokens.refreshToken,
          },
        });
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithGoogle = async (idToken: string, phone?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, phone }),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
            accessToken: result.data.tokens.accessToken,
            refreshToken: result.data.tokens.refreshToken,
          },
        });
      }

      return result;
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: 'Google login failed. Please try again.' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithPhone = async (phone: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/phone-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      return await response.json();
    } catch (error) {
      console.error('Phone login error:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyPhoneLogin = async (phone: string, otp: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${API_BASE}/auth/verify-phone-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
            accessToken: result.data.tokens.accessToken,
            refreshToken: result.data.tokens.refreshToken,
          },
        });
      }

      return result;
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      return { success: false, message: 'OTP verification failed. Please try again.' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data.user,
            accessToken: result.data.tokens.accessToken,
            refreshToken: result.data.tokens.refreshToken,
          },
        });
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      if (state.accessToken) {
        await makeAuthenticatedRequest(`${API_BASE}/auth/logout`, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const verifyEmail = async (otp: string) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { isEmailVerified: true },
        });
      }

      return result;
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, message: 'Email verification failed. Please try again.' };
    }
  };

  const verifyPhone = async (otp: string) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/auth/verify-phone`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { isPhoneVerified: true },
        });
      }

      return result;
    } catch (error) {
      console.error('Phone verification error:', error);
      return { success: false, message: 'Phone verification failed. Please try again.' };
    }
  };

  const resendEmailOTP = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/auth/resend-email-otp`, {
        method: 'POST',
      });

      return await response.json();
    } catch (error) {
      console.error('Resend email OTP error:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const resendPhoneOTP = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/auth/resend-phone-otp`, {
        method: 'POST',
      });

      return await response.json();
    } catch (error) {
      console.error('Resend phone OTP error:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!state.refreshToken) return false;

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        dispatch({
          type: 'SET_TOKENS',
          payload: {
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          },
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: data,
        });
      }

      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Profile update failed. Please try again.' };
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithGoogle,
    loginWithPhone,
    verifyPhoneLogin,
    register,
    logout,
    verifyEmail,
    verifyPhone,
    resendEmailOTP,
    resendPhoneOTP,
    refreshAccessToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;