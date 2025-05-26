"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Scholarship {
  id: number;
  name: string;
  provider: string;
  description: string;
  amount: string;
  levels: string[];
  country: string;
  deadline: string;
  field: string;
}

const FilteredResults = () => {
  const searchParams = useSearchParams();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState('Business, Engineering, Arts');
  const [selectedDate, setSelectedDate] = useState('Jan 15, 2023');

  useEffect(() => {
    // In a real application, this would fetch from your API
    // For now, we'll use mock data
    const mockScholarships = [
      {
        id: 1,
        name: 'Scholarship Foundation',
        provider: 'Merit-based scholarship',
        description: 'For students with outstanding academic achievements',
        amount: '$5,000',
        levels: ['Undergraduate'],
        country: 'USA',
        deadline: 'Jan 15, 2023',
        field: 'Engineering'
      },
      {
        id: 2,
        name: 'Education Fund',
        provider: 'Need-based scholarship',
        description: 'Supporting students from low-income backgrounds',
        amount: '$2,000',
        levels: ['Graduate'],
        country: 'Canada',
        deadline: 'Feb 28, 2023',
        field: 'Business'
      },
      {
        id: 3,
        name: 'Future Makers',
        provider: 'Merit & need-based',
        description: 'For aspiring leaders in technology',
        amount: '$2,000',
        levels: ['Undergraduate', 'Graduate'],
        country: 'UK',
        deadline: 'Mar 15, 2023',
        field: 'Computer Science'
      },
      {
        id: 4,
        name: 'Admissions Gateway',
        provider: 'All students',
        description: 'For international students seeking study abroad',
        amount: '$800',
        levels: ['Undergraduate'],
        country: 'International',
        deadline: 'Apr 30, 2023',
        field: 'Various'
      }
    ];

    setScholarships(mockScholarships);
  }, [searchParams]);

  return (
    <div className="flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-1/4 p-6 bg-blue-50">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your search results</h2>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded shadow-sm">
              <select className="w-full p-1 border border-gray-200 rounded font-medium">
                <option value="">Level of study</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="phd">PhD</option>
                <option value="postdoc">Postdoc</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <select className="w-full p-1 border border-gray-200 rounded font-medium">
                <option value="">Destination</option>
                <option value="usa">USA</option>
                <option value="canada">Canada</option>
                <option value="uk">UK</option>
                <option value="international">International</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <select className="w-full p-1 border border-gray-200 rounded font-medium">
                <option value="">Field of study</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="cs">Computer Science</option>
                <option value="various">Various</option>
              </select>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <select className="w-full p-1 border border-gray-200 rounded font-medium">
                <option value="">Application deadline</option>
                <option value="jan-feb">Jan 2023 - Feb 2023</option>
                <option value="mar-apr">Mar 2023 - Apr 2023</option>
                <option value="may-jun">May 2023 - Jun 2023</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-yellow-300 py-2 font-medium rounded mt-4">
            Filter
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Refine search?</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Fund Type</h3>
            <select className="w-full p-2 border rounded bg-white">
              <option value="">Select fund type</option>
              <option value="fullyFunded">Fully funded scholarships</option>
              <option value="partiallyFunded">Partially funded scholarships</option>
              <option value="undergraduate">Undergraduate scholarships</option>
            </select>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Sponsor type</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" name="sponsor" id="government" className="mr-2" />
                <label htmlFor="government">Government</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="sponsor" id="organization" className="mr-2" />
                <label htmlFor="organization">Organization</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="sponsor" id="university" className="mr-2" />
                <label htmlFor="university">University</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="sponsor" id="others" className="mr-2" />
                <label htmlFor="others">Others</label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Application rating</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="radio" name="rating" id="easy" className="mr-2" />
                <label htmlFor="easy">Easy</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="rating" id="medium" className="mr-2" />
                <label htmlFor="medium">Medium</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="rating" id="hard" className="mr-2" />
                <label htmlFor="hard">Hard</label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Scholarship category</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="merit" className="mr-2" />
                <label htmlFor="merit">Merit-based</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="need" className="mr-2" />
                <label htmlFor="need">Need-based</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="country" className="mr-2" />
                <label htmlFor="country">Country-specific</label>
              </div>
               <div className="flex items-center">
                <input type="checkbox" id="Sports" className="mr-2" />
                <label htmlFor="Sports">Sports</label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-center text-sm font-medium">ScholarMatch</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-3/4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-md text-gray-500">
            <span className="font-semibold">140</span> search result for{" "}
            <span className="font-semibold">{searchQuery}</span>, {selectedDate}
          </h1>
          <div className="flex items-center">
            <span className="mr-2">Sort by</span>
            <button className="bg-blue-50 px-3 py-1 rounded">↑↓</button>
          </div>
        </div>
        
        {/* Scholarship Cards */}
        <div className="space-y-4">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="flex">
                {/* Scholarship Image */}
                <div className="w-1/5 bg-gray-200 flex items-center justify-center p-4">
                  <div className="relative h-20 w-20">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Image</span>
                    </div>
                  </div>
                </div>
                
                {/* Scholarship Details */}
                <div className="w-4/5 p-4 flex">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-blue-600">{scholarship.name}</h2>
                      <div className="bg-blue-50 px-2 py-1 text-sm rounded-md">
                        {scholarship.country}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{scholarship.provider}</p>
                    <p className="text-gray-500 text-sm mt-1">{scholarship.description}</p>
                    <div className="mt-2">
                      <span className="text-gray-600 text-sm">Deadline: {scholarship.deadline}</span>
                    </div>
                  </div>
                  
                  {/* Right side with amount and button */}
                  <div className="w-1/4 flex flex-col items-end justify-between">
                    <div className="text-xl font-bold">{scholarship.amount}</div>
                    <button className="bg-yellow-300 hover:bg-yellow-400 px-4 py-1 rounded text-sm font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-1">
            <button className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center font-semibold">1</button>
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">2</button>
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">3</button>
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">4</button>
            <span className="w-8 h-8 flex items-center justify-center">...</span>
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">25</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilteredResults;
