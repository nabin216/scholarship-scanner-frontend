'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import './scrollbar-hide.css';

interface ScholarshipProvider {
  id: number;
  title: string;
  image?: string; // Making this optional since it might not exist
  country_name?: string;
  country?: {
    name: string;
  };
  country_detail?: {
    name: string;
  };
}

const FeaturedProviders = () => {
  const [providers, setProviders] = useState<ScholarshipProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const scrollContainer = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
    const fetchFeaturedScholarships = async () => {
      try {
        setLoading(true);
        // Fetch featured scholarships from the backend
        const response = await fetch('http://localhost:8000/api/scholarships/?is_featured=true');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured scholarships: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats - DRF pagination vs. direct array
        const scholarships = Array.isArray(data) ? data : 
                            data.results ? data.results : 
                            [];
                            
        console.log('Fetched scholarships:', scholarships);
        setProviders(scholarships);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured scholarships:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch featured scholarships');
        setLoading(false);
        
        // Use placeholder data in case of error
        // setProviders([
        //   {
        //     id: 1,
        //     title: 'Scholarship Hub',
        //     image: '/images/providers/scholarship-hub.jpg',
        //     country_name: 'Global',
        //   },
        //   {
        //     id: 2,
        //     title: 'Future Leaders Fund',
        //     image: '/images/providers/future-leaders.jpg',
        //     country_name: 'International',
        //   },
        //   {
        //     id: 3,
        //     title: 'Dream Achievers Program',
        //     image: '/images/providers/dream-achievers.jpg',
        //     country_name: 'National',
        //   },
        //   {
        //     id: 4,
        //     title: 'Global Scholars Network',
        //     image: '/images/providers/global-scholars.jpg',
        //     country_name: 'Regional',
        //   },
        //   {
        //     id: 5,
        //     title: 'Opportunity Seekers Club',
        //     image: '/images/providers/opportunity-seekers.jpg',
        //     country_name: 'Local',
        //   },
        // ]);
      }
    };
    
    fetchFeaturedScholarships();
  }, []);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const container = scrollContainer.current;
      const scrollAmount = 300; // Adjust as needed
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setScrollPosition(scrollPosition + scrollAmount);
      }
    }
  };
  
  const showLeftArrow = scrollPosition > 0;
  const showRightArrow = scrollContainer.current ? 
    scrollContainer.current.scrollWidth > scrollContainer.current.clientWidth + scrollPosition : 
    providers.length > 5;
  
  return (
    <div className="relative">
      {/* Left arrow (only show if not at the start) */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
        {/* Scholarship providers container with horizontal scroll */}
      <div 
        ref={scrollContainer}
        className="flex overflow-x-auto scrollbar-hide gap-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[240px] w-[240px] h-[280px] flex-shrink-0 bg-gray-100 p-6 rounded-lg animate-pulse flex flex-col">
              <div className="w-full h-32 bg-gray-200 rounded mb-4 flex-shrink-0"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-4 flex-grow"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mt-auto flex-shrink-0"></div>
            </div>
          ))
        ) : error ? (
          <div className="p-4 text-red-600">Error: {error}</div>
        ) : !Array.isArray(providers) || providers.length === 0 ? (
          <div className="p-4 text-gray-500">No featured scholarships available</div>        ) : (
          providers.map(provider => (
            <div 
              key={provider.id} 
              className="min-w-[240px] w-[240px] h-[290px] flex-shrink-0 bg-white p-6 rounded-lg text-center hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer transform hover:scale-105"
              onClick={() => window.location.href = `/scholarships/${provider.id}`}
            >
              <div className="mb-4 flex-shrink-0">
                <img 
                  src={provider.image || '/images/providers/scholarship-default.jpg'} 
                  alt={provider.title} 
                  className="w-full h-32 object-cover rounded" 
                  onError={(e) => {
                    e.currentTarget.src = '/images/providers/scholarship-default.jpg';
                  }}
                />
              </div>              <div className="flex-grow flex flex-col">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                  {provider.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 mt-1">{provider.country_name || 'Global'}</p>
              </div>
              <button className="text-sm text-blue-600 hover:underline flex-shrink-0 pointer-events-none">
                View Details →
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Right arrow (only show if not at the end) */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default FeaturedProviders;
