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
        
        // Map home filter names to search page filter names
        const filterMapping = {
            level: 'levels',
            country: 'country',
            field: 'field_of_study',
            deadline: 'deadline_before'
        };
        
        // Only add parameters that have values
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) {
                const mappedKey = filterMapping[key as keyof typeof filterMapping];
                if (mappedKey) {
                    queryParams.append(mappedKey, value);
                }
            }
        });

        // Navigate to the scholarships search page with filters
        router.push(`/scholarships/search?${queryParams.toString()}`);
    };

    return (
        <div className="bg-[#E8EEF7] rounded-full shadow-md flex items-center">
            <div className="flex-1 grid grid-cols-4 divide-x divide-gray-200">
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Level</div>                    <select 
                        name="level"
                        value={filterValues.level}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select Level</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Research">Research</option>
                    </select>
                </div>
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Country</div>                    <select 
                        name="country"
                        value={filterValues.country}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select Country</option>
                        <option value="Australia">Australia</option>
                        <option value="Canada">Canada</option>
                        <option value="China">China</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                    </select>
                </div>
                <div className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Field</div>                    <select 
                        name="field"
                        value={filterValues.field}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent text-gray-500 border-none focus:ring-0 text-sm py-1"
                    >
                        <option value="">Select field</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                        <option value="Social Sciences">Social Sciences</option>
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
