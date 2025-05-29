"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scholarship } from '../../../types/scholarship';
import Link from 'next/link';

export default function ScholarshipDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarshipDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/scholarships/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch scholarship details');
        }
        const data = await response.json();
        setScholarship(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarshipDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Scholarship not found'}
          </div>
          <Link 
            href="/scholarships/search"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/scholarships/search"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{scholarship.title}</h1>
                <div className="flex gap-3 text-sm text-gray-500">
                  <span>
                    Created: {new Date(scholarship.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Last updated: {new Date(scholarship.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {scholarship.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Main Information */}
            <div className="col-span-2 space-y-6">
              {/* Image */}
              {scholarship.image && (
                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={scholarship.image} 
                    alt={scholarship.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div 
                  dangerouslySetInnerHTML={{ __html: scholarship.description }}
                  className="prose max-w-none text-gray-600"
                />
              </div>

              {/* Study Fields */}
              {scholarship.field_of_study.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Fields of Study</h2>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.field_of_study.map(field => (
                      <span 
                        key={field.id}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {field.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Application Button */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Key Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  {scholarship.open_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Opening Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(scholarship.open_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href={scholarship.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Information</h3>
                <div className="space-y-3 text-sm">
                  {/* Country */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Country:</span>                    <span className="font-medium text-gray-900">
                      {scholarship.country && scholarship.country.name}
                    </span>
                  </div>

                  {/* Education Levels */}
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Education Level:</span>
                    <div className="text-right">
                      {scholarship.levels.map(level => (
                        <div key={level.id} className="font-medium text-gray-900">{level.name}</div>
                      ))}
                    </div>
                  </div>

                  {/* Fund Types */}
                  {scholarship.fund_type.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Fund Type:</span>
                      <div className="text-right">
                        {scholarship.fund_type.map(type => (
                          <div key={type.id} className="font-medium text-gray-900">{type.name}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sponsor Types */}
                  {scholarship.sponsor_type.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Sponsor Type:</span>
                      <div className="text-right">
                        {scholarship.sponsor_type.map(type => (
                          <div key={type.id} className="font-medium text-gray-900">{type.name}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Language Requirements */}
                  {scholarship.language_requirement.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Language Requirements:</span>
                      <div className="text-right">
                        {scholarship.language_requirement.map(lang => (
                          <div key={lang.id} className="font-medium text-gray-900">{lang.name}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {scholarship.scholarship_category.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.scholarship_category.map(category => (
                      <span 
                        key={category.id}
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}