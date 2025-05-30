"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scholarship, Filters, SortConfig } from '../../../types/scholarship';
import Link from 'next/link';
import { useAuth } from '../../Authentication/context/AuthContext';

const ScholarshipSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    levels: '',
    country: '',
    field_of_study: '',
    fund_type: '',
    sponsor_type: '',
    scholarship_category: '',
    deadline_before: '',
    language_requirement: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'deadline', direction: 'asc' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savingScholarships, setSavingScholarships] = useState<Set<number>>(new Set());
  const [savedScholarships, setSavedScholarships] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    if (searchParams) {
      const newFilters = { ...filters };
      let hasChanges = false;
      
      ['levels', 'country', 'field_of_study', 'fund_type', 'sponsor_type', 'scholarship_category', 'deadline_before', 'language_requirement'].forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          newFilters[param as keyof Filters] = value;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setFilters(newFilters);
      }
    }
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch scholarships based on filters
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        // Add each filter value if it exists
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
        
        const apiUrl = `http://localhost:8000/api/scholarships/?${queryParams}`;
        console.log('Fetching scholarships with URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Scholarships data:', data);
        
        // Handle both paginated and non-paginated responses
        const scholarshipsList = data.results || data;
        setScholarships(Array.isArray(scholarshipsList) ? scholarshipsList : []);
        
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch scholarships');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [filters]);

  // Fetch saved scholarships for authenticated users
  useEffect(() => {
    const fetchSavedScholarships = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
          if (response.ok) {
          const data = await response.json();
          const savedIds = new Set<number>(
            (data.results || data).map((saved: any) => saved.scholarship as number)
          );
          setSavedScholarships(savedIds);
        }
      } catch (error) {
        console.error('Error fetching saved scholarships:', error);
      }
    };

    fetchSavedScholarships();
  }, [isAuthenticated]);

  const handleSaveScholarship = async (scholarshipId: number) => {
    if (!isAuthenticated) {
      alert('Please log in to save scholarships');
      return;
    }

    setSavingScholarships(prev => new Set(prev).add(scholarshipId));

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (savedScholarships.has(scholarshipId)) {
        // Remove from saved
        const savedResponse = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          const savedItem = (savedData.results || savedData).find(
            (item: any) => item.scholarship === scholarshipId
          );
          
          if (savedItem) {
            const deleteResponse = await fetch(
              `http://localhost:8000/api/user/saved-scholarships/${savedItem.id}/`,
              {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              }
            );
            
            if (deleteResponse.ok) {
              setSavedScholarships(prev => {
                const newSet = new Set(prev);
                newSet.delete(scholarshipId);
                return newSet;
              });
            }
          }
        }
      } else {
        // Add to saved
        const response = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scholarship: scholarshipId }),
        });

        if (response.ok) {
          setSavedScholarships(prev => new Set(prev).add(scholarshipId));
        } else {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 400 && errorData.non_field_errors && 
              errorData.non_field_errors[0]?.includes('already exists')) {
            setSavedScholarships(prev => new Set(prev).add(scholarshipId));
          } else {
            throw new Error('Failed to save scholarship');
          }
        }
      }
    } catch (error) {
      console.error('Error saving scholarship:', error);
      alert('Failed to save scholarship. Please try again.');
    } finally {
      setSavingScholarships(prev => {
        const newSet = new Set(prev);
        newSet.delete(scholarshipId);
        return newSet;
      });
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      levels: '',
      country: '',
      field_of_study: '',
      fund_type: '',
      sponsor_type: '',
      scholarship_category: '',
      deadline_before: '',
      language_requirement: ''
    });
  };

  const handleSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setIsDropdownOpen(false);
  };

  const sortScholarships = (scholarships: Scholarship[]) => {
    return [...scholarships].sort((a, b) => {
      switch (sortConfig.field) {
        case 'deadline':
          return sortConfig.direction === 'asc' 
            ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case 'title':
          return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'country':
          return sortConfig.direction === 'asc' 
            ? (a.country_name || '').localeCompare(b.country_name || '')
            : (b.country_name || '').localeCompare(a.country_name || '');
        case 'open_date':
          return sortConfig.direction === 'asc' 
            ? new Date(a.open_date || '').getTime() - new Date(b.open_date || '').getTime()
            : new Date(b.open_date || '').getTime() - new Date(a.open_date || '').getTime();
        case 'created_at':
          return sortConfig.direction === 'asc' 
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  };

  const sortedScholarships = sortScholarships(scholarships);

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}
      
      <div className="mx-4 md:mx-8 lg:mx-12 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              <svg 
                className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>          {/* Filter Sidebar */}
          <div className={`${mobileFiltersOpen ? 'fixed inset-y-0 left-0 z-50 w-full max-w-sm' : 'hidden'} lg:block lg:relative lg:z-auto lg:w-1/4 lg:max-w-none`}>
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 lg:sticky lg:top-6 h-full lg:h-auto overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  {/* Mobile close button */}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Countries</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={filters.levels}
                    onChange={(e) => handleFilterChange('levels', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Postdoctoral">Postdoctoral</option>
                  </select>
                </div>

                {/* Field of Study Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study
                  </label>
                  <select
                    value={filters.field_of_study}
                    onChange={(e) => handleFilterChange('field_of_study', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Fields</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Business">Business</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Law">Law</option>
                  </select>
                </div>

                {/* Fund Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fund Type
                  </label>
                  <select
                    value={filters.fund_type}
                    onChange={(e) => handleFilterChange('fund_type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Fund Types</option>
                    <option value="Full Funding">Full Funding</option>
                    <option value="Partial Funding">Partial Funding</option>
                    <option value="Tuition Only">Tuition Only</option>
                    <option value="Living Allowance">Living Allowance</option>
                  </select>
                </div>

                {/* Scholarship Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.scholarship_category}
                    onChange={(e) => handleFilterChange('scholarship_category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Merit-based">Merit-based</option>
                    <option value="Need-based">Need-based</option>
                    <option value="Research">Research</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Minority">Minority</option>
                  </select>
                </div>

                {/* Deadline Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline Before
                  </label>
                  <input
                    type="date"
                    value={filters.deadline_before}
                    onChange={(e) => handleFilterChange('deadline_before', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Apply Filters Button for Mobile */}
                <div className="lg:hidden pt-4">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with Sort */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Search Scholarships
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {loading ? 'Loading...' : `${scholarships.length} scholarships found`}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-auto bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between gap-2"
                  >
                    <span>Sort by: {sortConfig.field.replace('_', ' ')} ({sortConfig.direction})</span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        {(['deadline', 'title', 'country', 'created_at'] as const).map((field) => (
                          <button
                            key={field}
                            onClick={() => handleSort(field)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) =>
                      value ? (
                        <div key={key} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          <span>{key.replace('_', ' ')}: {value}</span>
                          <button
                            onClick={() => handleFilterChange(key as keyof Filters, '')}
                            className="hover:text-blue-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading scholarships...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}            
            {/* Scholarship Cards */}
            {!loading && !error && (
              <div className="space-y-4">
                {sortedScholarships.length > 0 ? (
                  sortedScholarships.map((scholarship) => (
                    <div key={scholarship.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <Link 
                        href={scholarship.application_url || `/scholarships/scholarshipdetails?id=${scholarship.id}`}
                        target={scholarship.application_url ? "_blank" : "_self"}
                        className="block"
                      >                        {/* Mobile Layout */}
                        <div className="block sm:hidden relative">
                          {/* Country in top right corner */}
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              📍 {scholarship.country_detail?.name || scholarship.country_name}
                            </span>
                          </div>

                          <div className="flex pb-3 pr-3">
                            {/* Left side 1:1 image - larger with no margins or radius */}
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {scholarship.image ? (
                                <img 
                                  src={scholarship.image} 
                                  alt={scholarship.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">No Image</span>
                                </div>
                              )}
                            </div>                            {/* Right side details */}
                            <div className="flex-1 min-w-0 ml-3">
                              {/* Fund type and sponsor tags */}
                              <div className="flex flex-wrap gap-1 mb-2 mt-6">
                                {scholarship.fund_type.slice(0, 1).map((type) => (
                                  <span key={type.id} className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                                    {type.name}
                                  </span>
                                ))}
                                {scholarship.sponsor_type.slice(0, 1).map((sponsor) => (
                                  <span key={sponsor.id} className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">
                                    {sponsor.name}
                                  </span>
                                ))}
                              </div>

                              {/* Provider */}
                              <p className="text-gray-600 text-xs font-medium truncate mb-2">{scholarship.provider}</p>

                              {/* Deadline */}
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Deadline:</span>{' '}
                                <span className="text-red-600 font-semibold">
                                  {new Date(scholarship.deadline).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>                          {/* Save button in bottom right corner */}
                          <div className="absolute bottom-2 right-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSaveScholarship(scholarship.id);
                              }}
                              disabled={savingScholarships.has(scholarship.id)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                savedScholarships.has(scholarship.id)
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              } ${savingScholarships.has(scholarship.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {savingScholarships.has(scholarship.id) 
                                ? 'Saving...' 
                                : savedScholarships.has(scholarship.id) 
                                  ? '✓ Saved' 
                                  : '💾 Save'
                              }
                            </button>
                          </div>                          {/* Bottom section with title and levels */}
                          <div className="px-3 pb-3 space-y-1">
                            {/* Title */}
                            <h3 className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                              {scholarship.title}
                            </h3>
                            
                            {/* Levels */}
                            <div className="text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Levels:</span>{' '}
                                {scholarship.levels.map((l) => l.name).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex sm:h-48">
                          {/* Scholarship Image */}
                          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {scholarship.image ? (
                              <img 
                                src={scholarship.image} 
                                alt={scholarship.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">No Image</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Scholarship Details */}
                          <div className="flex-1 p-4">
                            <div className="flex flex-col space-y-2">
                              {/* Header with title and country */}
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                  {scholarship.title}
                                </h3>
                                <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                  📍 {scholarship.country_detail?.name || scholarship.country_name}
                                </span>
                              </div>
                              
                              {/* Provider */}
                              <p className="text-gray-600 text-sm font-medium">{scholarship.provider}</p>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {scholarship.fund_type.slice(0, 2).map((type) => (
                                  <span key={type.id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {type.name}
                                  </span>
                                ))}
                                {scholarship.sponsor_type.slice(0, 1).map((sponsor) => (
                                  <span key={sponsor.id} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    {sponsor.name}
                                  </span>
                                ))}
                                {scholarship.fund_type.length > 2 && (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{scholarship.fund_type.length - 2} more
                                  </span>
                                )}
                              </div>
                              
                              {/* Details Grid */}
                              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Levels:</span>{' '}
                                  {scholarship.levels.map((l) => l.name).join(', ')}
                                </div>
                                <div>
                                  <span className="font-medium">Deadline:</span>{' '}
                                  <span className="text-red-600 font-semibold">
                                    {new Date(scholarship.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>{/* Bottom row with save button */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                                <div className="flex-1"></div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleSaveScholarship(scholarship.id);
                                  }}
                                  disabled={savingScholarships.has(scholarship.id)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap self-end sm:self-auto ${
                                    savedScholarships.has(scholarship.id)
                                      ? 'bg-green-500 hover:bg-green-600 text-white'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  } ${savingScholarships.has(scholarship.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {savingScholarships.has(scholarship.id) 
                                    ? 'Saving...' 
                                    : savedScholarships.has(scholarship.id) 
                                      ? '✓ Saved' 
                                      : '💾 Save'
                                  }
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No scholarships found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your filters to see more results.
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSearch;
