"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../Authentication/context/AuthContext';

interface ScholarshipDetails {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  description: string;
  country?: string;
  country_name?: string;
  levels?: string[];
  categories?: string[];
  image?: string;
  application_url?: string;
}

interface SavedScholarship {
  id: number;
  scholarship: number; // This is the scholarship ID
  scholarship_details: ScholarshipDetails;
  date_saved: string;
}

export default function SavedScholarshipsPage() {
  const { user } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    const fetchSavedScholarships = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to view saved scholarships');
          setLoading(false);
          return;
        }        const response = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Your session has expired. Please log in again.');
          } else {
            setError(`Failed to fetch saved scholarships: ${response.status}`);
          }
          return;
        }          const data = await response.json();
        console.log('Saved scholarships API response:', data);
        setSavedScholarships(data.results || []);
      } catch (err) {
        console.error('Error fetching saved scholarships:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching saved scholarships');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedScholarships();
  }, []);
  const handleRemove = async (scholarshipId: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
        const response = await fetch(`http://localhost:8000/api/user/saved-scholarships/${scholarshipId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove scholarship');
      }
      
      // Remove from state
      setSavedScholarships(prev => prev.filter(item => item.id !== scholarshipId));
      setSuccessMessage('Scholarship removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error removing scholarship:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while removing the scholarship');
    }  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link href="/profile" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Profile
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Saved Scholarships</h1>
              <p className="text-gray-600 mt-2">Manage your bookmarked scholarships</p>
              {savedScholarships.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {savedScholarships.length} scholarship{savedScholarships.length !== 1 ? 's' : ''} saved
                </p>
              )}
            </div>
            <Link
              href="/scholarships/search"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Find More Scholarships
            </Link>
          </div>
        </div>
          
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {savedScholarships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scholarship
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Saved
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedScholarships.map((item) => {
                    const scholarshipDetails = item.scholarship_details;
                    
                    if (!scholarshipDetails) {
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td colSpan={6} className="px-6 py-4 text-center text-red-600">
                            Error: Missing scholarship details
                          </td>
                        </tr>
                      );
                    }
                    
                    const daysToDeadline = Math.ceil(
                      (new Date(scholarshipDetails.deadline).getTime() - new Date().getTime()) / 
                      (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link 
                              href={`/scholarships/scholarshipdetails?id=${scholarshipDetails.id}`}
                              className="hover:text-blue-600"
                            >
                              {scholarshipDetails.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {scholarshipDetails.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{scholarshipDetails.provider}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">${scholarshipDetails.amount}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(scholarshipDetails.deadline).toLocaleDateString()}
                          </div>
                          {daysToDeadline > 0 && daysToDeadline <= 30 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {daysToDeadline} days left
                            </span>
                          ) : daysToDeadline <= 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Expired
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {new Date(item.date_saved).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-3">
                            <Link 
                              href={`/scholarships/scholarshipdetails?id=${scholarshipDetails.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <span className="sr-only">View</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <span className="sr-only">Remove</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No saved scholarships</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't saved any scholarships yet.
              </p>
              <div className="mt-6">
                <Link
                  href="/scholarships/search"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Find Scholarships
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
