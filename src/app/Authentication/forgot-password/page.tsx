"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthService from '../../../services/authService';

interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordFormData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordData({
      email: e.target.value,
    });
  };

  const handleResetFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordData({
      ...resetPasswordData,
      [name]: value,
    });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow digits and limit to 6 characters
    const otpValue = value.replace(/\D/g, '').slice(0, 6);
    setResetPasswordData({
      ...resetPasswordData,
      otp: otpValue,
    });
  };

  const requestPasswordReset = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await AuthService.requestPasswordReset(forgotPasswordData.email);
      setSuccess(response.message || 'Password reset code sent to your email!');
      setResetPasswordData({
        ...resetPasswordData,
        email: forgotPasswordData.email,
      });
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.confirmPasswordReset({
        email: resetPasswordData.email,
        otp_code: resetPasswordData.otp,
        new_password: resetPasswordData.newPassword,
        new_password2: resetPasswordData.confirmPassword,
      });
      
      setSuccess(response.message || 'Password reset successful! You can now log in with your new password.');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/Authentication/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendPasswordResetCode = async () => {
    setResendLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await AuthService.requestPasswordReset(resetPasswordData.email);
      setSuccess(response.message || 'New password reset code sent to your email!');
      setResetPasswordData({ ...resetPasswordData, otp: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to resend password reset code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (step === 'request') {
      // Validate email
      if (!forgotPasswordData.email) {
        setError('Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotPasswordData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      await requestPasswordReset();
    } else if (step === 'reset') {
      // Validate OTP
      if (resetPasswordData.otp.length !== 6) {
        setError('Please enter a valid 6-digit verification code');
        return;
      }

      // Validate passwords
      if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
        setError('Please fill in all password fields');
        return;
      }

      if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Password strength validation
      if (resetPasswordData.newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      const hasLetters = /[a-zA-Z]/.test(resetPasswordData.newPassword);
      const hasNumbers = /\d/.test(resetPasswordData.newPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(resetPasswordData.newPassword);

      if (!(hasLetters && (hasNumbers || hasSpecial))) {
        setError('Password must include letters and at least numbers or special characters');
        return;
      }

      await confirmPasswordReset();
    }
  };

  const goBackToEmailInput = () => {
    setStep('request');
    setError(null);
    setSuccess(null);
    setResetPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'request' ? 'Reset your password' : 'Enter reset code'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'request' ? (
              <>
                Remember your password?{' '}
                <Link 
                  href="/Authentication/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </Link>
              </>
            ) : (
              `We've sent a 6-digit reset code to ${resetPasswordData.email}`
            )}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {step === 'request' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={forgotPasswordData.email}
                  onChange={handleEmailChange}
                />
                <p className="mt-2 text-sm text-gray-600">
                  We'll send you a 6-digit code to reset your password
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Sending reset code...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    Send Reset Code
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Reset Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={resetPasswordData.otp}
                  onChange={handleOtpChange}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="New password (min. 8 characters)"
                  value={resetPasswordData.newPassword}
                  onChange={handleResetFormChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                  value={resetPasswordData.confirmPassword}
                  onChange={handleResetFormChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || resetPasswordData.otp.length !== 6}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading || resetPasswordData.otp.length !== 6 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Resetting password...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Reset Password
                  </>
                )}
              </button>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={resendPasswordResetCode}
                  disabled={resendLoading}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
                
                <button
                  type="button"
                  onClick={goBackToEmailInput}
                  className="text-sm text-gray-600 hover:text-gray-500 font-medium"
                >
                  Change Email
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={resendPasswordResetCode}
                  disabled={resendLoading}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
