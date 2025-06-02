import ApiService from './apiService';

/**
 * Service for authentication-related API operations
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: {
    email: string;
    password: string;
    full_name: string;
  }) {
    return ApiService.post('user/auth/register/', userData);
  }
  
  /**
   * Verify OTP code
   */
  static async verifyOtp(verificationData: { email: string; otp_code: string }) {
    return ApiService.post('user/auth/verify-otp/', verificationData);
  }
  
  /**
   * Resend OTP code
   */
  static async resendOtp(email: string) {
    return ApiService.post('user/auth/resend-otp/', { email });
  }
  
  /**
   * Login user
   */
  static async login(credentials: { email: string; password: string }) {
    const response = await ApiService.post('user/auth/login/', credentials);
    
    if (response.access) {
      localStorage.setItem('authToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }
    }
    
    return response;
  }
  
  /**
   * Logout user
   */
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
  
  /**
   * Verify token
   */
  static async verifyToken(token: string) {
    return ApiService.post('user/auth/token/verify/', { token });
  }
  
  /**
   * Refresh token
   */
  static async refreshToken(refreshToken: string) {
    const response = await ApiService.post('user/auth/token/refresh/', { refresh: refreshToken });
    
    if (response.access) {
      localStorage.setItem('authToken', response.access);
    }
    
    return response;
  }
  
  /**
   * Get current user profile
   */
  static async getCurrentUser() {
    return ApiService.get('user/auth/me/', true);
  }
  
  /**
   * Google authentication
   */
  static async authenticateWithGoogle(googleData: { id_token: string, email: string, full_name: string }) {
    const response = await ApiService.post('user/auth/google/token/', googleData);
    
    if (response.access) {
      localStorage.setItem('authToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }
    }
    
    return response;
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string) {
    return ApiService.post('user/auth/password-reset-request/', { email });
  }

  /**
   * Confirm password reset with OTP
   */
  static async confirmPasswordReset(resetData: {
    email: string;
    otp_code: string;
    new_password: string;
    new_password2: string;
  }) {
    return ApiService.post('user/auth/password-reset-confirm/', resetData);
  }
}

export default AuthService;
