'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyIcon } from '@heroicons/react/24/outline';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    
    // Client-side validation
    // Check if any field is empty
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All password fields are required');
      setIsSaving(false);
      return;
    }
    
    // Check if the new password is same as current password
    if (formData.currentPassword === formData.newPassword) {
      setError('New password cannot be the same as current password');
      setIsSaving(false);
      return;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsSaving(false);
      return;
    }

    // Length check
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setIsSaving(false);
      return;
    }

    // Password complexity check
    const hasLetters = /[a-zA-Z]/.test(formData.newPassword);
    const hasNumbers = /\d/.test(formData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

    if (!(hasLetters && (hasNumbers || hasSpecial))) {
      setError('Password must include letters and at least numbers or special characters');
      setIsSaving(false);
      return;
    }
      try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
        
      // Log the request data for debugging      // Make sure field names exactly match what the backend expects
      const requestData = {
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password2: formData.confirmPassword,
      };
      console.log('Password change request data:', JSON.stringify(requestData));
        
      // Make sure the URL matches exactly what's in the backend urls.py
      const response = await fetch('http://localhost:8000/api/user/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });        if (!response.ok) {
        console.error('Password change failed with status:', response.status);
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Format error messages more user-friendly
        if (errorData.old_password) {
          throw new Error(`Current password: ${errorData.old_password[0]}`);
        } else if (errorData.new_password) {
          // This captures validation errors related to the new password
          throw new Error(`New password: ${errorData.new_password[0]}`);
        } else if (errorData.new_password2) {
          // This captures password mismatch errors
          throw new Error(`Confirm password: ${errorData.new_password2[0]}`);
        } else if (errorData.non_field_errors) {
          throw new Error(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (Object.keys(errorData).length > 0) {
          // Catch any other field errors that might be returned
          const firstError = Object.entries(errorData)[0];
          throw new Error(`${firstError[0]}: ${Array.isArray(firstError[1]) ? firstError[1][0] : firstError[1]}`);
        } else {
          throw new Error('Failed to change password. Please try again.');
        }
      }      // Parse the response
      const responseData = await response.json();
      console.log('Password change successful:', responseData);
      
      // Clear password fields and show success message
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage(responseData.message || 'Password changed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while changing password');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <KeyIcon className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="mt-1 text-sm text-gray-600">Update your account password</p>
        </div>
      </div>

      <div className="mt-6 max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />                <div className="mt-1 text-xs text-gray-500">
                  <p>Password requirements:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>At least 8 characters long</li>
                    <li>Must include letters</li>
                    <li>Must include at least one number or special character</li>
                    <li>Cannot be the same as your current password</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>            {/* Messages */}
            {message && (
              <div className="px-4 py-3 bg-green-50 border-l-4 border-green-500 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="px-4 py-3 bg-red-50 border-l-4 border-red-500 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Profile
                </button>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
