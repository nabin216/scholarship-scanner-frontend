'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';
import { useAuth } from '../app/Authentication/context/AuthContext';

// Profile Dropdown Component
const ProfileDropdown: React.FC<{ user: any; logout: () => void }> = ({ user, logout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="User menu"
            >                {/* Profile Picture */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {(user as any)?.profile_picture ? (
                        <img
                            src={(user as any).profile_picture}
                            alt={user?.name || 'Profile'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                
                {/* User Name */}
                <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user?.name || 'User'}
                </span>
                
                {/* Dropdown Arrow */}
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                }`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    
                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {/* User Info Header */}
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || 'No email'}
                            </p>
                        </div>
                        
                        {/* Menu Items */}
                        <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                            My Profile
                        </Link>
                          <Link
                            href="/profile/saved"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Saved Scholarships
                        </Link>
                          <Link
                            href="/profile/applications"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            My Applications
                        </Link>
                          <Link
                            href="/profile/password"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Change Password
                        </Link>
                        
                        {/* Divider */}
                        <hr className="my-2 border-gray-100" />
                        
                        <button
                            onClick={() => {
                                logout();
                                setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();    // Prevent body scroll when any menu is open
    useEffect(() => {
        if (isMenuOpen || isProfileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to restore scroll on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isProfileMenuOpen]);

    return (
        <header className="bg-white sticky top-0 z-50 py-2.5">
            <div className="mx-4 md:mx-8 lg:mx-12">            <div className="flex justify-between items-center">
                {/* Mobile menu button - moved to left */}
                <div className="flex items-center md:hidden">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle mobile menu"
                  >
                    {isMenuOpen ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* Logo and Navigation Links - now centered on mobile */}
                <div className="flex items-center space-x-6 md:ml-0">
                    {/* Logo is visible on all screens */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl md:text-2xl font-extrabold tracking-tight leading-none">
                            <span className="text-blue-600">Scholar</span>
                            <span className="text-yellow-500">Scanner</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation - visible only on md+ screens */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/scholarships/search" className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors">
                            Scholarships
                        </Link>
                        <Link href="/admissions" className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors">
                            Admissions
                        </Link>
                    </nav>
                </div>

                {/* Empty middle section to maintain layout */}
                <div className="hidden md:block flex-grow"></div>

                {/* Authentication Buttons */}
                <div className="flex items-center">                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                    {isAuthenticated ? (
                        <ProfileDropdown user={user} logout={logout} />
                    ) : (
                        <>
                            <Link href="/Authentication/register" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-4 py-2">
                                Register
                            </Link>
                            <Link href="/Authentication/login" className="bg-yellow-400 hover:bg-yellow-500 text-sm font-medium px-4 py-2 rounded-none transition-colors">
                                Log In
                            </Link>
                        </>
                    )}
                    </div>                {/* Mobile Profile Button */}
                    <div className="md:hidden">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => setIsProfileMenuOpen(true)}
                                className="flex items-center text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Open profile menu"
                            >                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {(user as any)?.profile_picture ? (
                                        <img
                                            src={(user as any).profile_picture}
                                            alt={user.name || 'Profile'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircleIcon className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                            </button>
                        ) : (
                            <Link href="/Authentication/login" className="bg-yellow-400 hover:bg-yellow-500 text-sm font-medium px-4 py-2 rounded-md transition-colors">
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </div>            {/* Mobile Navigation Overlay (General Menu) */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    
                    {/* Slide-out Menu */}
                    <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                          
                        {/* Menu Content - General Navigation Only */}
                        <nav className="flex flex-col p-4 space-y-4">
                            <Link 
                                href="/" 
                                className="text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/scholarships/search" 
                                className="text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Scholarships
                            </Link>
                            <Link 
                                href="/admissions" 
                                className="text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admissions
                            </Link>
                            
                            {/* Show auth buttons only if not authenticated */}
                            {!isAuthenticated && (
                                <div className="space-y-3 pt-4 border-t border-gray-200">                                <Link 
                                    href="/Authentication/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href="/Authentication/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </>
            )}            {/* Mobile Profile Menu Overlay */}
            {isProfileMenuOpen && isAuthenticated && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                    ></div>
                    
                    {/* Slide-out Profile Menu from Right */}
                    <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                        isProfileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                        {/* Profile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Profile</span>
                            <button
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Close profile menu"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                          
                        {/* Profile Menu Content */}
                        <nav className="flex flex-col p-4">
                            {/* User Info Header */}
                            <div className="flex items-center mb-4 px-3">                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
                                    {(user as any)?.profile_picture ? (
                                        <img
                                            src={(user as any).profile_picture}
                                            alt={user?.name || 'Profile'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email || 'No email'}
                                    </p>
                                </div>
                            </div>
                            
                            <hr className="border-gray-200 mb-4" />
                            
                            {/* Profile Links */}
                            <div className="space-y-1">
                                <Link 
                                    href="/profile" 
                                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                                    My Profile
                                </Link>
                                
                                <Link 
                                    href="/profile/saved" 
                                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Saved Scholarships
                                </Link>
                                
                                <Link 
                                    href="/profile/applications" 
                                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    My Applications
                                </Link>
                                  <Link 
                                    href="/profile/password" 
                                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Change Password
                                </Link>
                                
                                <hr className="border-gray-200 my-3" />
                                
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsProfileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left text-red-600 hover:text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                </>
            )}
            </div>
        </header>
    );
};

export default Header;