import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Calendar, Menu, X } from 'lucide-react';

function GuestLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header>
                <nav className="bg-white shadow-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Eventify
                                </span>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Events</a>
                                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">Categories</a>
                                <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition">About</a>
                                <Link to={'/login'} className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">
                                    Sign In
                                </Link>
                                <Link to={'/register'} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">
                                    Sign Up
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="md:hidden py-4 border-t">
                                <div className="flex flex-col gap-4">
                                    <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">Events</a>
                                    <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">Categories</a>
                                    <a href="#" className="text-gray-700 hover:text-purple-600 font-medium">About</a>
                                    <button className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">
                                        Sign In
                                    </button>
                                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default GuestLayout
