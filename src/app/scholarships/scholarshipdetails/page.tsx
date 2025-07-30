"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scholarship } from '../../../types/scholarship';
import { useAuth } from '../../Authentication/context/AuthContext';
import Link from 'next/link';

// Related Scholarships Component
const RelatedScholarships = ({ currentScholarshipId }: { currentScholarshipId: number }) => {
  const [relatedScholarships, setRelatedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedScholarships = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch random scholarships (excluding current one)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/?limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related scholarships');
        }

        const data = await response.json();
        const scholarships = data.results || data;
        
        // Filter out the current scholarship and take first 4
        const filteredScholarships = scholarships
          .filter((scholarship: Scholarship) => scholarship.id !== currentScholarshipId)
          .slice(0, 4);
        
        setRelatedScholarships(filteredScholarships);
      } catch (err) {
        console.error('Error fetching related scholarships:', err);
        setError('Failed to load related scholarships');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedScholarships();
  }, [currentScholarshipId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Scholarships</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Scholarships</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (relatedScholarships.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Scholarships</h3>
        <p className="text-gray-600 text-sm">No related scholarships found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Scholarships</h3>
      <div className="space-y-4">
        {relatedScholarships.map((scholarship) => {
          const deadlinePassed = isDeadlinePassed(scholarship.deadline);
          
          return (
            <Link
              key={scholarship.id}
              href={`/scholarships/scholarshipdetails?id=${scholarship.id}`}
              className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors"
            >
              <div className="flex gap-3">
                {/* Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={scholarship.image || '/images/providers/scholarship-default.jpg'}
                    alt={scholarship.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/providers/scholarship-default.jpg';
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1">
                    {scholarship.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {scholarship.provider}
                  </p>
                    <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {scholarship.country_name}
                    </span>
                    <span className={`font-medium ${deadlinePassed ? 'text-red-600' : 'text-green-600'}`}>
                      {formatDate(scholarship.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* View More Link */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/scholarships/search"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Scholarships →
        </Link>
      </div>
    </div>
  );
};

const ScholarshipDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);  const [expandedSections, setExpandedSections] = useState({
    requirements: false
  });

  const scholarshipId = searchParams?.get('id');

  // Helper function to convert HTML to plain text
  const htmlToPlainText = (html: string) => {
    if (!html) return '';
    
    return html
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> tags to line breaks
      .replace(/<\/p>/gi, '\n\n') // Convert closing </p> tags to double line breaks
      .replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .replace(/&nbsp;/g, ' ') // Convert non-breaking spaces
      .replace(/&amp;/g, '&') // Convert HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple line breaks
      .trim(); // Remove leading/trailing whitespace
  };

  // Fetch scholarship details
  useEffect(() => {
    const fetchScholarshipDetails = async () => {
      if (!scholarshipId) {
        setError('No scholarship ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/${scholarshipId}/`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Scholarship not found');
          } else {
            setError('Failed to fetch scholarship details');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setScholarship(data);
      } catch (err) {
        console.error('Error fetching scholarship:', err);
        setError('An error occurred while fetching scholarship details');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarshipDetails();
  }, [scholarshipId]);

  // Check if scholarship is saved and if user has applied
  useEffect(() => {
    const checkScholarshipStatus = async () => {
      if (!isAuthenticated || !scholarshipId) return;

      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;        // Check if saved
        const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-scholarships/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          const savedIds = (savedData.results || savedData).map((saved: any) => saved.scholarship);
          setIsSaved(savedIds.includes(parseInt(scholarshipId)));
        }        // Check if applied
        const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/applications/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          const applicationIds = (applicationsData.results || applicationsData).map((app: any) => app.scholarship);
          setHasApplied(applicationIds.includes(parseInt(scholarshipId)));
        }
      } catch (error) {
        console.error('Error checking scholarship status:', error);
      }
    };

    checkScholarshipStatus();
  }, [isAuthenticated, scholarshipId]);

  const handleSaveScholarship = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save scholarships');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (isSaved) {        // Remove from saved
        const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-scholarships/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          const savedItem = (savedData.results || savedData).find(
            (item: any) => item.scholarship === parseInt(scholarshipId!)
          );
          
          if (savedItem) {
            const deleteResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/user/saved-scholarships/${savedItem.id}/`,
              {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              }
            );
            
            if (deleteResponse.ok) {
              setIsSaved(false);
            }
          }
        }
      } else {        // Add to saved
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/saved-scholarships/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scholarship: parseInt(scholarshipId!) }),
        });

        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error saving scholarship:', error);
      alert('An error occurred while saving the scholarship');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-gray-600">Loading scholarship details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">{error || 'Scholarship not found'}</div>
            <Link 
              href="/scholarships/search" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Search
            </Link>
          </div>        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(scholarship.deadline);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 px-2 sm:px-4 py-4 sm:py-8 ml-0 lg:ml-8 xl:ml-16">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 max-w-4xl">
        {/* Navigation */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/scholarships/search" 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">          {/* Header Section */}
          <div className="relative">
            {scholarship.image && (
              <div className="w-full h-48 sm:h-64 bg-gray-200">
                <img 
                  src={scholarship.image} 
                  alt={scholarship.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/providers/scholarship-default.jpg';
                  }}
                />
              </div>
            )}              {/* Status badges */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 max-w-[120px] sm:max-w-none">
              {deadlinePassed && (
                <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center">
                  Deadline Passed
                </span>
              )}
            </div>
          </div>          {/* Content Section */}
          <div className="p-3 sm:p-6 lg:p-8">            {/* Title and Basic Info */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight pr-16 sm:pr-40">{scholarship.title}</h1>
              
              {/* Compact Mobile Info Layout */}
              <div className="block sm:hidden space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Provider:</span>
                  <span className="text-gray-600 text-right max-w-[60%] truncate">{scholarship.provider}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Country:</span>
                  <span className="text-gray-600">{scholarship.country_name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Deadline:</span>
                  <span className={`font-medium ${deadlinePassed ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDate(scholarship.deadline)}
                  </span>
                </div>
                {scholarship.open_date && (
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-gray-700">Open Date:</span>
                    <span className="text-gray-600">{formatDate(scholarship.open_date)}</span>
                  </div>
                )}
              </div>

              {/* Desktop Info Layout */}              <div className="hidden sm:grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-row items-center">
                  <span className="font-semibold text-gray-700 w-20">Provider:</span>
                  <span className="text-gray-600 break-words">{scholarship.provider}</span>
                </div>
                
                <div className="flex flex-row items-center">
                  <span className="font-semibold text-gray-700 w-20">Country:</span>
                  <span className="text-gray-600">{scholarship.country_name}</span>
                </div>
                
                <div className="flex flex-row items-center">
                  <span className="font-semibold text-gray-700 w-20">Deadline:</span>
                  <span className={`font-medium break-words ${deadlinePassed ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDate(scholarship.deadline)}
                  </span>
                </div>

                {scholarship.open_date && (
                  <div className="flex flex-row items-center">
                    <span className="font-semibold text-gray-700 w-20">Open Date:</span>
                    <span className="text-gray-600 break-words">{formatDate(scholarship.open_date)}</span>
                  </div>
                )}
              </div>
            </div>            {/* Key Details - using name: details format */}
            <div className="space-y-3 mb-6 sm:mb-8">
              {/* Academic Levels */}
              {scholarship.levels && scholarship.levels.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Academic Levels:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.levels.map((level, index) => (
                      <span key={level.id}>
                        {level.name}
                        {index < scholarship.levels.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Fields of Study */}
              {scholarship.field_of_study && scholarship.field_of_study.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Fields of Study:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.field_of_study.map((field, index) => (
                      <span key={field.id}>
                        {field.name}
                        {index < scholarship.field_of_study.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Categories */}
              {scholarship.scholarship_category && scholarship.scholarship_category.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Categories:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.scholarship_category.map((category, index) => (
                      <span key={category.id}>
                        {category.name}
                        {index < scholarship.scholarship_category.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Fund Types */}
              {scholarship.fund_type && scholarship.fund_type.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Fund Types:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.fund_type.map((fund, index) => (
                      <span key={fund.id}>
                        {fund.name}
                        {index < scholarship.fund_type.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Sponsor Types */}
              {scholarship.sponsor_type && scholarship.sponsor_type.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Sponsor Types:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.sponsor_type.map((sponsor, index) => (
                      <span key={sponsor.id}>
                        {sponsor.name}
                        {index < scholarship.sponsor_type.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Language Requirements */}
              {scholarship.language_requirement && scholarship.language_requirement.length > 0 && (
                <div className="text-sm sm:text-base flex">
                  <span className="font-semibold text-gray-700 w-36 lg:w-40 flex-shrink-0">Language Requirements:</span>
                  <span className="text-gray-600 whitespace-nowrap">
                    {scholarship.language_requirement.map((lang, index) => (
                      <span key={lang.id}>
                        {lang.name}
                        {index < scholarship.language_requirement.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>            {/* Description - Always Expanded */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {htmlToPlainText(scholarship.description)}
                </div>
              </div>
            </div>

            {/* Requirements - Collapsible */}
            {scholarship.requirements && (
              <div className="mb-6 sm:mb-8">
                <button
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setExpandedSections(prev => ({
                    ...prev,
                    requirements: !prev.requirements
                  }))}
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Requirements</h2>
                  <span className="text-gray-500 text-xl">
                    {expandedSections.requirements ? '−' : '+'}
                  </span>
                </button>
                
                {expandedSections.requirements && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                      <div dangerouslySetInnerHTML={{ __html: scholarship.requirements }} />
                    </div>
                  </div>
                )}
              </div>
            )}            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              {/* Apply Button */}
              <div className="sm:flex-shrink-0">
                {hasApplied ? (
                  <button 
                    disabled 
                    className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold cursor-not-allowed text-sm sm:text-base"
                  >
                    ✓ Applied
                  </button>
                ) : (
                  <a
                    href={scholarship.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-center transition-colors text-sm sm:text-base"
                  >
                    Apply Now
                  </a>
                )}
              </div>              {/* Save Button */}
              {isAuthenticated && (
                <button
                  onClick={handleSaveScholarship}
                  disabled={saving}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                    isSaved
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Saving...' : isSaved ? '✓ Saved' : '💾 Save for Later'}
                </button>
              )}
            </div>

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-xs sm:text-sm">
                  <Link href="/Authentication/login" className="underline hover:no-underline">
                    Log in
                  </Link>
                  {' '}to save scholarships and track your applications.                </p>
              </div>
            )}          </div>
        </div>
        </div>
        
        {/* Related Scholarships Sidebar */}
        <div className="w-full lg:w-1/3 lg:max-w-sm">
          <RelatedScholarships currentScholarshipId={scholarship.id} />
        </div>
      </div>
    </div>
  );
};

const ScholarshipDetails = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScholarshipDetailsContent />
    </Suspense>
  );
};

export default ScholarshipDetails;