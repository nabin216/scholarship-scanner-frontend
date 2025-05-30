import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Logo + Links Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 sm:mb-8">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                            ScholarMatch
                        </Link>

                    </div>
                    
                    {/* Navigation Links - Mobile Responsive */}
                    <nav className="w-full md:w-auto">
                        {/* Mobile: Stacked vertical links */}
                        <div className="flex flex-col space-y-3 md:hidden text-sm">
                            <Link href="/help-center" className="text-gray-600 hover:text-gray-900 py-1 transition-colors">Help Center</Link>
                            <Link href="/faq" className="text-gray-600 hover:text-gray-900 py-1 transition-colors">FAQ</Link>
                            <Link href="/support-team" className="text-gray-600 hover:text-gray-900 py-1 transition-colors">Support Team</Link>
                            <Link href="/how-to-works" className="text-gray-600 hover:text-gray-900 py-1 transition-colors">How it Works</Link>
                            <Link href="/get-in-touch" className="text-gray-600 hover:text-gray-900 py-1 transition-colors">Get in touch</Link>
                        </div>
                        
                        {/* Desktop: Horizontal links with separators */}
                        <div className="hidden md:block text-sm">
                            <Link href="/help-center" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</Link>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link href="/support-team" className="text-gray-600 hover:text-gray-900 transition-colors">Support Team</Link>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link href="/how-to-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</Link>
                            <span className="mx-2 text-gray-400">·</span>
                            <Link href="/get-in-touch" className="text-gray-600 hover:text-gray-900 transition-colors">Get in touch</Link>
                        </div>
                    </nav>
                </div>

                {/* Social Media Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
                        <span className="text-sm text-gray-600 font-medium">Follow us:</span>
                        <div className="flex space-x-4">
                            {/* Facebook */}
                            <a 
                                href="https://facebook.com/scholarmatch" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:scale-110 transition-transform duration-200"
                                aria-label="Follow us on Facebook"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            
                            {/* Twitter */}
                            <a 
                                href="https://twitter.com/scholarmatch" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:scale-110 transition-transform duration-200"
                                aria-label="Follow us on Twitter"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            
                            {/* Instagram */}
                            <a 
                                href="https://instagram.com/scholarmatch" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:scale-110 transition-transform duration-200"
                                aria-label="Follow us on Instagram"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.435-3.396-1.167-.563-.434-.563-1.167 0-1.601.948-.732 2.099-1.167 3.396-1.167 1.297 0 2.448.435 3.396 1.167.563.434.563 1.167 0 1.601-.948.732-2.099 1.167-3.396 1.167zm7.119 0c-1.297 0-2.448-.435-3.396-1.167-.563-.434-.563-1.167 0-1.601.948-.732 2.099-1.167 3.396-1.167 1.297 0 2.448.435 3.396 1.167.563.434.563 1.167 0 1.601-.948.732-2.099 1.167-3.396 1.167z"/>
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            
                            {/* LinkedIn */}
                            <a 
                                href="https://linkedin.com/company/scholarmatch" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:scale-110 transition-transform duration-200"
                                aria-label="Follow us on LinkedIn"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            
                            {/* Telegram */}
                            <a 
                                href="https://t.me/scholarmatch" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:scale-110 transition-transform duration-200"
                                aria-label="Follow us on Telegram"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section - Mobile Responsive */}
                <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col space-y-4 sm:hidden">
                        <div className="flex items-start space-x-3">
                            <img src="/images/icon-handshake.svg" alt="Handshake" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base mb-1 leading-tight">Psst! Find exclusive opportunities and insider tips!</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Do you want to discover hidden scholarships and advice from others? Sign up now to unlock your future!</p>
                            </div>
                        </div>
                        <button className="w-full bg-white text-sm font-medium px-6 py-3 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                            Join now
                        </button>
                    </div>
                    
                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center">
                            <img src="/images/icon-handshake.svg" alt="Handshake" className="w-12 h-12 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Psst! Find exclusive opportunities and insider tips!</h3>
                                <p className="text-sm text-gray-600">Do you want to discover hidden scholarships and advice from others? Sign up now to unlock your future!</p>
                            </div>
                        </div>
                        <button className="bg-white text-sm font-medium px-6 py-2 rounded-md hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex-shrink-0 ml-4">
                            Join now
                        </button>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center text-sm text-gray-500">
                    ScholarMatch ©️
                </div>
            </div>
        </footer>
    );
};

export default Footer;