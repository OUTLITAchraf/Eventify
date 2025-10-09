import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Calendar, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, LogoutUser, clearAuth } from '../features/auth/authSlice';

function AuthLayout() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            dispatch(fetchUser());
        } else if (!token) {
            dispatch(clearAuth());
        }
    }, [dispatch, user]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = async () => {
        try {
            await dispatch(LogoutUser()).unwrap();
            dispatch(clearAuth());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                                {user ? (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <User className="w-5 h-5 text-purple-600" />
                                            <span>{user.name}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 border-t"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Link to="/login" className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">Sign In</Link>
                                        <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">Sign Up</Link>
                                    </>
                                )}
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
                                    <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Events</Link>
                                    <Link to="#" className="text-gray-700 hover:text-purple-600 font-medium">Categories</Link>
                                    <Link to="#" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="text-gray-700 hover:text-purple-600 font-medium">Profile</Link>
                                            <button onClick={handleLogout} className="px-6 py-2 text-red-600 border-2 border-red-500 rounded-lg font-semibold hover:bg-red-50 transition">
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">Sign In</Link>
                                            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">Sign Up</Link>
                                        </>
                                    )}
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

export default AuthLayout;