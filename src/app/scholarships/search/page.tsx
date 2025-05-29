"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scholarship } from '../../../types/scholarship';
import Link from 'next/link';
import { useAuth } from '../../Authentication/context/AuthContext';

interface Filters {
  levels: string;
  country: string;
  field_of_study: string;
  fund_type: string;
  sponsor_type: string;
  scholarship_category: string;
  deadline_before: string;
  language_requirement: string;
}

interface SortConfig {
  field: 'deadline' | 'title' | 'country' | 'open_date' | 'created_at' | 'levels' | 'field_of_study';
  direction: 'asc' | 'desc';
}

const ScholarshipSearch = () => {  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);    const [filters, setFilters] = useState<Filters>({
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
  const [savedScholarships, setSavedScholarships] = useState<Set<number>>(new Set());    // Initialize filters from URL parameters
  useEffect(() => {
    if (searchParams) {
      const newFilters = {...filters};
      let hasChanges = false;
      
      console.log('URL searchParams:', Object.fromEntries([...searchParams.entries()]));
      
      ['levels', 'country', 'field_of_study', 'fund_type', 'sponsor_type', 'scholarship_category', 'deadline_before', 'language_requirement'].forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          newFilters[param as keyof Filters] = value;
          hasChanges = true;
          console.log(`Setting filter ${param}=${value}`);
        }
      });
      
      if (hasChanges) {
        setFilters(newFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        // Build query params based on filters
        const queryParams = new URLSearchParams();
        
        // Add each filter value if it exists
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            // All filters are applied directly
            queryParams.append(key, value);
            console.log(`Applying filter: ${key}=${value}`);
            if (key === 'country') {
              console.log('Country filter value is a string name, not an ID');
            }
          }
        });
        
        const apiUrl = `http://localhost:8000/api/scholarships/?${queryParams}`;
        console.log('Fetching scholarships with URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch scholarships: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API returned data:', data);
        
        // Handle paginated response structure
        setScholarships(data.results || []);
        
        // Log filter results
        console.log(`Found ${data.results ? data.results.length : 0} scholarships matching filters`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [filters, searchParams]);

  // Fetch saved scholarships when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSavedScholarships();
    }
  }, [isAuthenticated, user]);

  const fetchSavedScholarships = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/user/saved-scholarships/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });      if (response.ok) {
        const data = await response.json();
        const savedIds = new Set<number>(data.map((saved: any) => Number(saved.scholarship)));
        setSavedScholarships(savedIds);
      }
    } catch (error) {
      console.error('Error fetching saved scholarships:', error);
    }
  };

  const handleSaveScholarship = async (scholarshipId: number) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/Authentication/login');
      return;
    }

    setSavingScholarships(prev => new Set(prev).add(scholarshipId));

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');

      if (savedScholarships.has(scholarshipId)) {
        // Remove from saved
        const response = await fetch(`http://localhost:8000/api/user/saved-scholarships/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const savedItems = await response.json();
          const savedItem = savedItems.find((item: any) => item.scholarship === scholarshipId);
          
          if (savedItem) {
            const deleteResponse = await fetch(`http://localhost:8000/api/user/saved-scholarships/${savedItem.id}/`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });

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
            // Already saved, just update state
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
            : b.title.localeCompare(a.title);        case 'country':
          const countryA = a.country_detail?.name || a.country_name || '';
          const countryB = b.country_detail?.name || b.country_name || '';
          return sortConfig.direction === 'asc'
            ? countryA.localeCompare(countryB)
            : countryB.localeCompare(countryA);
        case 'open_date':
          if (!a.open_date || !b.open_date) return 0;
          return sortConfig.direction === 'asc'
            ? new Date(a.open_date).getTime() - new Date(b.open_date).getTime()
            : new Date(b.open_date).getTime() - new Date(a.open_date).getTime();
        case 'created_at':
          return sortConfig.direction === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'levels':
          const levelsA = a.levels.map(l => l.name).sort().join(', ');
          const levelsB = b.levels.map(l => l.name).sort().join(', ');
          return sortConfig.direction === 'asc'
            ? levelsA.localeCompare(levelsB)
            : levelsB.localeCompare(levelsA);
        case 'field_of_study':
          const fieldsA = a.field_of_study.map(f => f.name).sort().join(', ');
          const fieldsB = b.field_of_study.map(f => f.name).sort().join(', ');
          return sortConfig.direction === 'asc'
            ? fieldsA.localeCompare(fieldsB)
            : fieldsB.localeCompare(fieldsA);
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const sortedScholarships = sortScholarships(scholarships);

  return (    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-full max-w-[95%] mx-auto px-2">
        <div className="py-4">
          <Link href="/#" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Homepage
          </Link>
          {/* <h1 className="text-2xl font-bold mt-2 mb-6">Advanced Scholarship Search</h1> */}
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 p-4 bg-blue-50 rounded-t-lg md:rounded-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm">              
                  <select 
                    className="w-full p-1 border border-gray-200 rounded font-medium"
                    value={filters.levels}
                    onChange={(e) => handleFilterChange('levels', e.target.value)}
                  >                
                    <option value="">Level of study</option>
                    {scholarships && scholarships.length > 0 && Array.isArray(scholarships) && 
                      scholarships
                        .flatMap(s => s.levels || [])
                        .filter((level, index, self) => 
                          index === self.findIndex(l => l.id === level.id)
                        )
                        .map(level => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))
                    }
                  </select>
                </div>                  <div className="bg-white p-3 rounded shadow-sm">              
                  <select 
                    className="w-full p-1 border border-gray-200 rounded font-medium"
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                  >
                    <option value="">Country</option>                    {/* Use countries with their IDs */}
                    {scholarships && scholarships.length > 0 && Array.isArray(scholarships) &&                      Array.from(new Set(
                        scholarships
                          .filter(s => s.country_detail?.name || s.country_name)
                          .map(s => s.country_detail?.name || s.country_name)
                      ))
                      .sort()
                      .map(countryName => (
                        <option key={countryName} value={countryName}>{countryName}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="bg-white p-3 rounded shadow-sm">
                  <select 
                    className="w-full p-1 border border-gray-200 rounded font-medium"
                    value={filters.field_of_study}
                    onChange={(e) => handleFilterChange('field_of_study', e.target.value)}
                  >                
                    <option value="">Field of study</option>
                    {scholarships && scholarships.length > 0 && Array.isArray(scholarships) && 
                      scholarships
                        .flatMap(s => s.field_of_study || [])
                        .filter((field, index, self) => 
                          index === self.findIndex(f => f.id === field.id)
                        )
                        .map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))
                    }
                  </select>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <input 
                    type="date" 
                    id="deadline-before"
                    className="w-full p-1 border border-gray-200 rounded font-medium"
                    value={filters.deadline_before}
                    onChange={(e) => handleFilterChange('deadline_before', e.target.value)}
                    placeholder="Select deadline"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Additional Filters</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Fund Type</h3>            
                <div className="space-y-2">
                  {scholarships && scholarships.length > 0 && Array.isArray(scholarships) &&
                    scholarships
                      .flatMap(s => s.fund_type || [])
                      .filter((fund, index, self) => 
                        index === self.findIndex(f => f.id === fund.id)
                      )
                      .map(fund => (
                        <div key={fund.id} className="flex items-center">
                          <input
                            type="radio"
                            name="fundType"
                            id={`fund-${fund.id}`}
                            className="mr-2"
                            checked={filters.fund_type === String(fund.id)}
                            onChange={() => handleFilterChange('fund_type', String(fund.id))}
                          />
                          <label htmlFor={`fund-${fund.id}`}>{fund.name}</label>
                        </div>
                      ))
                  }
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Sponsor type</h3>            
                <div className="space-y-2">
                  {scholarships && scholarships.length > 0 && Array.isArray(scholarships) &&
                    scholarships
                      .flatMap(s => s.sponsor_type || [])
                      .filter((sponsor, index, self) => 
                        index === self.findIndex(s => s.id === sponsor.id)
                      )
                      .map(sponsor => (
                        <div key={sponsor.id} className="flex items-center">
                          <input
                            type="radio"
                            name="sponsor"
                            id={`sponsor-${sponsor.id}`}
                            className="mr-2"
                            checked={filters.sponsor_type === String(sponsor.id)}
                            onChange={() => handleFilterChange('sponsor_type', String(sponsor.id))}
                          />
                          <label htmlFor={`sponsor-${sponsor.id}`}>{sponsor.name}</label>
                        </div>
                      ))
                  }
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Scholarship category</h3>            
                <div className="space-y-2">
                  {scholarships && scholarships.length > 0 && Array.isArray(scholarships) &&
                    scholarships
                      .flatMap(s => s.scholarship_category || [])
                      .filter((category, index, self) => 
                        index === self.findIndex(c => c.id === category.id)
                      )
                      .map(category => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            id={`category-${category.id}`}
                            className="mr-2"
                            checked={filters.scholarship_category === String(category.id)}
                            onChange={() => handleFilterChange('scholarship_category', String(category.id))}
                          />
                          <label htmlFor={`category-${category.id}`}>{category.name}</label>
                        </div>
                      ))
                  }
                </div>
              </div>
                {/* Language Requirements Section */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Language Requirements</h3>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="space-y-2">
                    {scholarships && scholarships.length > 0 && Array.isArray(scholarships) &&
                      scholarships
                        .flatMap(s => s.language_requirement || [])
                        .filter((lang, index, self) => 
                          index === self.findIndex(l => l.id === lang.id)
                        )
                        .map(language => (
                          <div key={language.id} className="flex items-center">
                            <input
                              type="radio"
                              name="language"
                              id={`lang-${language.id}`}
                              className="mr-2"
                              checked={filters.language_requirement === String(language.id)}
                              onChange={() => handleFilterChange('language_requirement', String(language.id))}
                            />
                            <label htmlFor={`lang-${language.id}`}>{language.name}</label>
                          </div>                        ))
                    }
                  </div>
                </div>
              </div>
              
              {/* Clear All Filters Button */}
              <div className="mt-8 pb-4">
                <button 
                  onClick={clearAllFilters}
                  className="w-full bg-white text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded shadow-sm hover:shadow-md transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-md text-gray-500">
                <span className="font-semibold">{scholarships.length}</span> scholarships found
              </h1>
              <div className="flex items-center">
                <span className="mr-2">Sort by</span>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
                  >                    {sortConfig.field === 'deadline' && 'Deadline'}
                    {sortConfig.field === 'title' && 'Title'}
                    {sortConfig.field === 'country' && 'Country'}
                    {sortConfig.field === 'open_date' && 'Opening Date'}
                    {sortConfig.field === 'created_at' && 'Recently Added'}
                    {sortConfig.field === 'levels' && 'Education Level'}
                    {sortConfig.field === 'field_of_study' && 'Field of Study'}
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                    {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 divide-y divide-gray-100">
                      {/* Dates Group */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500">Dates</div>
                        <button 
                          onClick={() => handleSort('deadline')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'deadline' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Deadline
                          {sortConfig.field === 'deadline' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                        <button 
                          onClick={() => handleSort('open_date')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'open_date' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Opening Date
                          {sortConfig.field === 'open_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                        <button 
                          onClick={() => handleSort('created_at')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'created_at' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Recently Added
                          {sortConfig.field === 'created_at' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                      </div>
                      
                      {/* Basic Info Group */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500">Basic Info</div>
                        <button 
                          onClick={() => handleSort('title')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'title' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          </svg>
                          Title
                          {sortConfig.field === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                        <button 
                          onClick={() => handleSort('country')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'country' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                          </svg>
                          Country
                          {sortConfig.field === 'country' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                      </div>

                      {/* Categories Group */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500">Categories</div>
                        <button 
                          onClick={() => handleSort('levels')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'levels' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          Education Level
                          {sortConfig.field === 'levels' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                        <button 
                          onClick={() => handleSort('field_of_study')}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${sortConfig.field === 'field_of_study' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Field of Study
                          {sortConfig.field === 'field_of_study' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>        
            
            {/* Active Filters */}        
            {(filters.levels || filters.country || filters.field_of_study || filters.fund_type || 
              filters.sponsor_type || filters.scholarship_category || filters.deadline_before) && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Active filters:</span>
                  <button 
                    onClick={clearAllFilters}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(filters).map(([key, value]) => 
                    value ? (
                      <div key={key} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-2">
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
                
            {/* Scholarship Cards */}
            <div className="space-y-4">
              {sortedScholarships && sortedScholarships.length > 0 && Array.isArray(sortedScholarships) && sortedScholarships.map((scholarship) => (
                <div key={scholarship.id} className="bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer">
                  <Link 
                    href={scholarship.application_url ? scholarship.application_url : `/scholarships/scholarshipdetails?id=${scholarship.id}`}
                    target={scholarship.application_url ? "_blank" : "_self"}
                    className="block"
                  >
                  <div className="flex">                    {/* Scholarship Image */}
                    <div className="w-1/5 bg-gray-200 flex items-center justify-center">
                      {scholarship.image ? (
                        <img 
                          src={scholarship.image} 
                          alt={scholarship.title}
                          className="h-full w-full object-cover"
                        />                      ) : (
                        <div className="w-full aspect-square bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Scholarship Details */}
                    <div className="w-4/5 p-4 flex">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-blue-600">{scholarship.title}</h2>
                        </div>
                        
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {scholarship.fund_type.map(cat => (
                            <span key={`fund-${cat.id}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {cat.name}
                            </span>
                          ))}
                          {scholarship.sponsor_type.map(sponsor => (
                            <span key={`sponsor-${sponsor.id}`} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {sponsor.name}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 flex gap-4">
                          <span className="text-gray-600 text-sm">
                            Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                          </span>
                          <span className="text-gray-600 text-sm">
                            Levels: {scholarship.levels.map(l => l.name).join(', ')}
                          </span>
                        </div>
                      </div>                        {/* Right side with button */}
                      <div className="w-1/4 flex flex-col items-end justify-between">
                        <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                          {scholarship.country_detail?.name || scholarship.country_name}
                        </span>                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleSaveScholarship(scholarship.id);
                          }}
                          disabled={savingScholarships.has(scholarship.id)}
                          className={`px-4 py-2 rounded text-sm font-medium z-10 transition-colors ${
                            savedScholarships.has(scholarship.id)
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } ${savingScholarships.has(scholarship.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {savingScholarships.has(scholarship.id) 
                            ? 'Saving...' 
                            : savedScholarships.has(scholarship.id) 
                              ? 'Saved ✓' 
                              : 'Save for later'
                          }
                        </button>
                      </div></div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {(!scholarships || scholarships.length === 0) && (
              <div className="text-center py-10">
                <p className="text-gray-500">No scholarships found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSearch;
