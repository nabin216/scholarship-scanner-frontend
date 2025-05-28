"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/context/AuthContext';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import countryList from 'country-list';

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  education: string;
  phone_number: string;
  country: string;
  date_of_birth: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CountryOption {
  value: string;
  label: string;
}

const countryOptions: CountryOption[] = countryList.getData().map((country: { code: string; name: string }) => ({
  value: country.code,
  label: country.name
}));

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    bio: '',
    education: '',
    phone_number: '',
    country: '',
    date_of_birth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || ''
      }));
      
      // Fetch additional user profile data
      fetchUserProfile();
    }
  }, [user]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/Authentication/login');
    }
  }, [loading, isAuthenticated, router]);
    const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
        const response = await fetch('http://localhost:8000/api/user/auth/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
        if (response.ok) {        const userData = await response.json();
        // Check if profile data is nested or directly on the user object
        const profileData = userData.profile || userData;
        
        setFormData(prevData => ({
          ...prevData,
          name: userData.full_name || userData.name || prevData.name,
          email: userData.email || prevData.email,
          bio: profileData.bio || '',
          education: profileData.education || '',
          phone_number: profileData.phone_number || '',
          country: profileData.country || '',
          date_of_birth: profileData.date_of_birth ? profileData.date_of_birth.substring(0, 10) : '',
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setError(null);
      setMessage(null);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token not found');      // Create a FormData instance to send the file
        const formData = new FormData();
        
        // Django DRF expects multipart/form-data for nested serializers to be properly formatted
        formData.append('profile.profile_picture', file);
        
        // Send the profile picture to the backend
        const response = await fetch('http://localhost:8000/api/user/users/update-profile/', {
          method: 'PATCH', // Using PATCH to update only the profile picture
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type header when sending FormData
          },
          body: formData,
        });
        
        if (!response.ok) {
          console.error('Profile picture upload failed with status:', response.status);
          const errorData = await response.json().catch(e => ({ detail: 'Could not parse error response' }));
          throw new Error(errorData.detail || 'Failed to upload profile picture');
        }
        
        setMessage('Profile picture updated successfully');
        
        // Refresh user profile data to show the new picture
        fetchUserProfile();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while uploading profile picture');
      }
    }
  };
    const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
        const response = await fetch('http://localhost:8000/api/user/users/update-profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          full_name: formData.name,
          profile: {
            bio: formData.bio || "",
            education: formData.education || "",
            phone_number: formData.phone_number || "",
            country: formData.country || "",
            date_of_birth: formData.date_of_birth || null,
          }
        }),
      });
        if (!response.ok) {
        console.error('Profile update failed with status:', response.status);
        const errorData = await response.json().catch(e => ({ detail: 'Could not parse error response' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || `Failed to update profile: ${response.status}`);
      }
        setMessage('Profile updated successfully');
      setIsEditing(false);
      setPreviewImage(null); // Clear preview image after successful update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };
    const handleChangePassword = async (e: React.FormEvent) => {
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
      if (!token) throw new Error('Authentication token not found');      const response = await fetch('http://localhost:8000/api/user/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: formData.currentPassword,
          new_password: formData.newPassword,
          new_password2: formData.confirmPassword,  // Added to match the expected format in backend
        }),
      });        if (!response.ok) {
        console.error('Password change failed with status:', response.status);
        const errorData = await response.json().catch(e => ({ detail: 'Could not parse error response' }));
        console.error('Error response:', errorData);
        
        // Format error messages more user-friendly
        if (errorData.old_password) {
          throw new Error(`Current password: ${errorData.old_password[0]}`);
        } else if (errorData.new_password) {
          throw new Error(`New password: ${errorData.new_password[0]}`);
        } else if (errorData.new_password2) {
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
      }
      
      // Clear password fields and show success message
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      setMessage('Password changed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while changing password');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Information
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === 'applications'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
                onClick={() => setActiveTab('applications')}
              >
                My Applications
              </button>
            </li>
          </ul>
        </div>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
        
        {message && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage(null); // Clear any preview image when canceling edit
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {/* Profile Picture Section */}
            <div className="flex items-center mb-6">              <div className="flex-shrink-0 mr-4">
                {previewImage ? (
                  // Show preview of newly selected image
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-blue-300"
                  />
                ) : user && user.profile && user.profile.profile_picture ? (
                  // Show existing profile picture
                  <img
                    src={user.profile.profile_picture}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  // Show default avatar
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 mb-2">Profile Picture</p>
                  <label 
                    htmlFor="profile_picture" 
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer text-sm text-gray-700"
                  >
                    Change Photo
                  </label>                  <input 
                    type="file" 
                    id="profile_picture"
                    name="profile_picture" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
              )}
            </div>
            
            <form onSubmit={handleSavePersonalInfo}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email address cannot be changed.</p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                  <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select education level</option>
                    <option value="high_school">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                  <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  {isEditing ? (
                    <Select<CountryOption>
                      id="country"
                      name="country"
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === formData.country) || null}
                      onChange={(selectedOption) => {
                        setFormData(prev => ({
                          ...prev,
                          country: selectedOption?.value || ''
                        }));
                      }}
                      className="w-full"
                      classNamePrefix="react-select"
                    />
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={countryOptions.find(option => option.value === formData.country)?.label || formData.country}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                    />
                  )}
                </div>
                
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full px-4 py-2 ${
                      isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full px-4 py-2 ${
                    isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {isSaving ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">My Scholarship Applications</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scholarship
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Applied
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample data - This would be populated from API in a real app */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">International Student Scholarship</div>
                      <div className="text-sm text-gray-500">University of Example</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">May 15, 2025</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">View Details</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Engineering Excellence Award</div>
                      <div className="text-sm text-gray-500">Technical Institute</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">April 28, 2025</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">View Details</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Research Grant Program</div>
                      <div className="text-sm text-gray-500">National Science Foundation</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">March 12, 2025</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Rejected
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">View Details</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Empty state */}
            {/* 
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start applying for scholarships to see your applications here.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => router.push('/scholarships/search')}
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Browse Scholarships
                </button>
              </div>
            </div>
            */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;