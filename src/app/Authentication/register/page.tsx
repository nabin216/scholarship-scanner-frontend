"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerificationData {
  email: string;
  otp: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationData, setVerificationData] = useState<VerificationData>({
    email: '',
    otp: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow digits and limit to 6 characters
    const otpValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationData({
      ...verificationData,
      otp: otpValue,
    });
  };

  const sendVerificationEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/api/user/auth/send-verification-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to send verification email');
      }

      const data = await response.json();
      setSuccess(data.message || 'Verification code sent to your email!');
      setVerificationData({ email, otp: '' });
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending verification email');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/user/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationData.email,
          otp_code: verificationData.otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Invalid verification code');
      }

      // OTP verified, now proceed with registration
      await completeRegistration();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const response = await fetch('http://localhost:8000/api/user/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationData.email,
          password: formData.password,
          password2: formData.confirmPassword,
          full_name: formData.fullName,
          first_name: firstName,
          last_name: lastName || '',
          otp_code: verificationData.otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 
          Object.values(errorData).map(err => 
            Array.isArray(err) ? err.join(', ') : err
          ).join(', ');
        throw new Error(errorMessage || 'Registration failed');
      }

      const data = await response.json();
      
      // Store tokens if provided
      if (data.access) {
        localStorage.setItem('authToken', data.access);
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
      }

      setSuccess('Registration successful! Redirecting to your profile...');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/api/user/auth/resend-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationData.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to resend verification code');
      }

      const data = await response.json();
      setSuccess(data.message || 'New verification code sent to your email!');
      setVerificationData({ ...verificationData, otp: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while resending verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (step === 'register') {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      // Send verification email
      await sendVerificationEmail(formData.email);
    } else if (step === 'verify') {
      if (verificationData.otp.length !== 6) {
        setError('Please enter a valid 6-digit verification code');
        return;
      }

      await verifyOtp();
    }
  };

  const goBackToRegister = () => {
    setStep('register');
    setError(null);
    setSuccess(null);
    setVerificationData({ email: '', otp: '' });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'register' ? 'Create a new account' : 'Verify your email'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'register' ? (
              <>
                Or{' '}
                <Link 
                  href="/Authentication/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  sign in to your account
                </Link>
              </>
            ) : (
              `We've sent a 6-digit verification code to ${verificationData.email}`
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
        
        {step === 'register' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="full-name" className="sr-only">Full Name</label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password (min. 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
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
                    Sending verification email...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    Send Verification Email
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or register with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <GoogleSignInButton text="Sign up with Google" />
              </div>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
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
                  value={verificationData.otp}
                  onChange={handleOtpChange}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Enter the 6-digit code sent to your email address
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || verificationData.otp.length !== 6}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading || verificationData.otp.length !== 6 
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Verify & Complete Registration
                  </>
                )}
              </button>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendLoading}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
                
                <button
                  type="button"
                  onClick={goBackToRegister}
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
                  onClick={resendOtp}
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
