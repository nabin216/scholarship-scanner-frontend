'use client';

import { useState, useEffect } from 'react';
import ScholarshipService from '../services/scholarship';
import config from '../utils/config';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  provider: string;
  amount: number | null;
  deadline: string;
}

export default function ScholarshipList() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await ScholarshipService.getScholarships();
        setScholarships(response.results || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError('Failed to load scholarships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading scholarships...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <p className="mt-4 text-sm">
          API URL: {config.apiUrl} 
          {/* This shows the value from the .env file */}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Available Scholarships</h2>
      {scholarships.length === 0 ? (
        <p>No scholarships found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
            <div 
              key={scholarship.id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-2">{scholarship.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Provider: {scholarship.provider}
              </p>
              {scholarship.amount && (
                <p className="text-green-600 font-medium mb-2">
                  ${scholarship.amount.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-4">
                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm mb-4">
                {scholarship.description.substring(0, 150)}
                {scholarship.description.length > 150 ? '...' : ''}
              </p>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
        <p>Environment Info (for demonstration):</p>
        <p>API URL: {config.apiUrl}</p>
        <p>JWT Expiry: {config.jwtExpiry} seconds</p>
      </div>
    </div>
  );
}
