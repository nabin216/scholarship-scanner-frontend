"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  bio?: string;
  education?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  profile_picture?: string;
}

interface User {
  id?: string;
  name?: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  profile?: UserProfile;
  date_joined?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: (token: string, userData: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already authenticated on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // First, verify the token is valid
          const verifyResponse = await fetch('http://localhost:8000/api/user/auth/token/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!verifyResponse.ok) {
            console.log("Token invalid, status:", verifyResponse.status);
            // Try to use refresh token if available
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const refreshResponse = await fetch('http://localhost:8000/api/user/auth/token/refresh/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ refresh: refreshToken }),
                });
                
                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json();
                  localStorage.setItem('authToken', refreshData.access);
                  // Continue with the new token
                  fetchUserData(refreshData.access);
                  return;
                }
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
              }
            }
            
            // If we get here, both token verify and refresh failed
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
          
          // Token is valid, get user data
          await fetchUserData(token);
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    const fetchUserData = async (token: string) => {
      try {
        const response = await fetch('http://localhost:8000/api/user/auth/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });
          
          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData.id,
              name: userData.full_name || userData.name,
              email: userData.email,
            });
            setIsAuthenticated(true);
            console.log("User authenticated successfully on page refresh");
          } else {
            console.log("Failed to get user data, status:", response.status);
            // Token might be valid but user data fetch failed
            localStorage.removeItem('authToken');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {          console.error('Authentication check failed:', error);
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      };

    checkAuth();
  }, []);
  const loginWithGoogle = async (): Promise<void> => {
    // Open Google OAuth popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    // Construct Google OAuth URL
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=604558986475-755fbv5bvlnamnhdm3fts9ck54ujbkv4.apps.googleusercontent.com` +
      `&redirect_uri=${encodeURIComponent('http://localhost:3001/Authentication/google-callback')}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&nonce=${Math.random().toString(36).substring(2, 15)}` +
      `&prompt=select_account`;    // Open the Google OAuth popup
    const popup = window.open(
      googleOAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
    );
    
    // Create a message listener to handle the callback
    window.addEventListener('message', async (event) => {
      // Only accept messages from our own domain
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        if (popup) popup.close();
          try {
          await handleGoogleCallback(event.data.token, event.data.user);
          router.push('/profile');
        } catch (error) {
          console.error('Google auth callback error:', error);
        }      }
    });
  };

  const handleGoogleCallback = async (token: string, userData: any): Promise<void> => {
    try {      // Exchange the Google auth token for our app JWT
      const response = await fetch('http://localhost:8000/api/user/auth/google/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          id_token: token, 
          email: userData.email,
          full_name: userData.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google authentication failed');
      }

      const data = await response.json();
      console.log("Google auth response:", data);
      
      // Store tokens based on what's returned
      if (data.access) {
        // JWT format
        localStorage.setItem('authToken', data.access);
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
      } else if (data.token) {
        // Legacy token format
        localStorage.setItem('authToken', data.token);
      }
      
      setUser({
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
      });
      
      setIsAuthenticated(true);
    } catch (error) {      console.error('Google auth error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Clear any existing tokens first
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      const response = await fetch('http://localhost:8000/api/user/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      console.log("Login response:", data);
      
      // Store tokens - we're using JWT which returns access and refresh tokens
      if (data.access) {
        localStorage.setItem('authToken', data.access);
      } else if (data.token) {
        // Fallback for non-JWT authentication
        localStorage.setItem('authToken', data.token);
      }
      
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      // Update user state
      setUser({
        id: data.user?.id,
        name: data.user?.full_name || data.user?.name,
        email: data.user?.email || email,
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false); // Make sure loading is always set to false
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');      const response = await fetch('http://localhost:8000/api/user/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          password2: password, // Password confirmation required by backend
          full_name: name,
          first_name: firstName,
          last_name: lastName || '' // If no last name provided, use empty string
        }),
      });      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 
          Object.values(errorData).map(err => 
            Array.isArray(err) ? err.join(', ') : err
          ).join(', ');
        throw new Error(errorMessage || 'Registration failed');
      }

      const data = await response.json();
      
      // Some APIs might return a token immediately after registration
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setUser({
          id: data.user?.id,
          name: data.user?.name || name,
          email: data.user?.email || email,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to login page
    router.push('/Authentication/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    handleGoogleCallback,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
