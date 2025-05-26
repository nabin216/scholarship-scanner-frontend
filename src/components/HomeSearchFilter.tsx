"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HomeSearchFilter = () => {
    const router = useRouter();
    const [filterValues, setFilterValues] = useState({
        level: '',
        country: '',
        field: '',
        deadline: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({ ...prev, [name]: value }));
    };    const handleArrowClick = () => {
        // Build query parameters from filter values
        const queryParams = new URLSearchParams();
        
        // Only add parameters that have values
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        // Navigate to the filtered results page
        router.push(`/search/filtered?${queryParams.toString()}`);
    };

    return (
        <div className="bg-[#E8EEF7] rounded-full shadow-md flex items-center">
            <div className="flex-1 grid grid-cols-4 divide-x divide-gray-200">
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Level</div>
                    <select 
                        name="level"
                        value={filterValues.level}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select Level</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="masters">Master's</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Country</div>
                    <select 
                        name="country"
                        value={filterValues.country}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select Country</option>
                        <option value="usa">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="canada">Canada</option>
                    </select>
                </div>
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Field</div>
                    <select 
                        name="field"
                        value={filterValues.field}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select field</option>
                        <option value="engineering">Engineering</option>
                        <option value="business">Business</option>
                        <option value="medicine">Medicine</option>
                    </select>
                </div>
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Deadline</div>
                    <input 
                        type="date" 
                        name="deadline"
                        value={filterValues.deadline}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    />
                </div>
            </div>
            <div className="px-2">
                <button 
                    onClick={handleArrowClick}
                    className="bg-[#FFE814] hover:bg-[#FFE200] text-black rounded-full h-12 w-12 flex items-center justify-center transition-colors"
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default HomeSearchFilter;
