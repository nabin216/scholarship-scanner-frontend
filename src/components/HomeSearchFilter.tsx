"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface FilterOptions {
    levels: Array<{id: number, name: string}>;
    countries: string[];
    fields: Array<{id: number, name: string}>;
    languages: Array<{id: number, name: string}>;
}

const HomeSearchFilter = () => {
    const router = useRouter();
    const [filterValues, setFilterValues] = useState({
        level: '',
        country: '',
        field: '',
        deadline: '',
        language: ''
    });
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        levels: [],
        countries: [],
        fields: [],
        languages: []
    });    const [loading, setLoading] = useState(true);
    
    // Fetch filter options from backend
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/scholarships/');                if (response.ok) {
                    const data = await response.json();
                    const scholarships = data.results || [];
                      console.log('Raw API data:', data);
                    console.log('First scholarship sample:', scholarships[0]);
                    console.log('Country data in first scholarship:', {
                        country: scholarships[0]?.country,
                        country_detail: scholarships[0]?.country_detail,
                        country_name: scholarships[0]?.country_name
                    });
                    // Extract unique levels
                    const levels = scholarships
                        .flatMap((s: any) => s.levels || [])
                        .filter((level: any, index: number, self: any[]) => 
                            level && level.id && index === self.findIndex(l => l && l.id === level.id)
                        );                    // Extract unique countries by name
                    const countries = scholarships.reduce((uniqueCountries: string[], s: any) => {
                        // Use country_detail.name or country_name as fallback
                        const countryName = s.country_detail?.name || s.country_name;
                        if (countryName && !uniqueCountries.includes(countryName)) {
                            uniqueCountries.push(countryName);
                        }
                        return uniqueCountries;
                    }, []).sort();
                    
                    // Extract unique fields of study
                    const fields = scholarships
                        .flatMap((s: any) => s.field_of_study || [])
                        .filter((field: any, index: number, self: any[]) => 
                            field && field.id && index === self.findIndex(f => f && f.id === field.id)
                        );
                    
                    // Extract unique language requirements
                    const languages = scholarships
                        .flatMap((s: any) => s.language_requirement || [])
                        .filter((lang: any, index: number, self: any[]) => 
                            lang && lang.id && index === self.findIndex(l => l && l.id === lang.id)
                        );
                      setFilterOptions({
                        levels,
                        countries,
                        fields,
                        languages
                    });
                    
                    console.log("Fetched filter options:", { levels, countries, fields, languages });
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };    const handleArrowClick = () => {
        // Build query parameters from filter values
        const queryParams = new URLSearchParams();
        
        // Map home filter names to search page filter names
        const filterMapping = {
            level: 'levels',
            country: 'country',
            field: 'field_of_study',
            deadline: 'deadline_before',
            language: 'language_requirement'
        };
          // Only add parameters that have values
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) {
                const mappedKey = filterMapping[key as keyof typeof filterMapping];
                if (mappedKey) {
                    queryParams.append(mappedKey, value);
                    console.log(`Adding filter: ${mappedKey}=${value}`);
                }
            }
        });

        // Navigate to the scholarships search page with filters
        router.push(`/scholarships/search?${queryParams.toString()}`);
    };

    return (        <div className="bg-[#E8EEF7] rounded-full shadow-md flex items-center">
            <div className="flex-1 grid grid-cols-5 divide-x divide-gray-200">                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Level</div>
                    <select 
                        name="level"
                        value={filterValues.level}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                        disabled={loading}
                    >
                        <option value="">Select Level</option>
                        {filterOptions.levels.map(level => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                    </select>
                </div>                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Country</div>                    <select 
                        name="country"
                        value={filterValues.country}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                        disabled={loading}
                    >                        <option value="">Select Country</option>
                        {filterOptions.countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Field</div>
                    <select 
                        name="field"
                        value={filterValues.field}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                        disabled={loading}
                    >
                        <option value="">Select field</option>
                        {filterOptions.fields.map(field => (
                            <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                    </select>
                </div><div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Deadline</div>
                    <input 
                        type="date" 
                        name="deadline"
                        value={filterValues.deadline}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    />
                </div>                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Language</div>
                    <select 
                        name="language"
                        value={filterValues.language}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                        disabled={loading}
                    >
                        <option value="">Select language</option>
                        {filterOptions.languages.map(language => (
                            <option key={language.id} value={language.id}>{language.name}</option>
                        ))}
                    </select>
                </div>
            </div>            <div className="px-2">
                <button 
                    onClick={handleArrowClick}
                    disabled={loading}
                    className={`rounded-full h-12 w-12 flex items-center justify-center transition-colors ${
                        loading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-[#FFE814] hover:bg-[#FFE200] text-black'
                    }`}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
                    ) : (
                        <ArrowRightIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default HomeSearchFilter;
