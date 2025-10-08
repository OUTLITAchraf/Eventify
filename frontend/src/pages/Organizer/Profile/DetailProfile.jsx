import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../features/auth/authSlice';
import { Calendar, User, Mail, Shield, Edit2, Save, X, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function DetailProfile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const role = user?.roles?.[0]?.display_name || "User";

    // Form data for editing
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await dispatch(fetchUser(token)).unwrap();
                    setUser(userData);
                    // Initialize form data with user data
                    setFormData({
                        name: userData.name,
                        email: userData.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            }
        };

        fetchUserData();
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Add your update API call here
        try {
            // Example: await dispatch(updateUser(formData)).unwrap();
            
            // Update local user state
            setUser(prev => ({
                ...prev,
                name: formData.name,
                email: formData.email
            }));
            
            setIsEditing(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            
            // Reset password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    const getRoleBadge = (roleText) => {
        const isOrganizer = roleText.toLowerCase().includes('organizer');
        if (isOrganizer) {
            return (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                    {roleText}
                </span>
            );
        }
        return (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                {roleText}
            </span>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Alert */}
                {showAlert && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Profile updated successfully!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    {/* Header Section with Avatar */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center sm:text-left sm:mt-16">
                                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-600 mb-2">{user.email}</p>
                                {getRoleBadge(role)}
                            </div>

                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="sm:mt-16 flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Information Display */}
                {!isEditing && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Account Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-lg text-gray-800 font-medium">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                                    <p className="text-lg text-gray-800 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-500">Account Role</label>
                                    <p className="text-lg text-gray-800 font-medium">{role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {isEditing && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Personal Information Section */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="pt-6 border-t">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Account Security</h4>
                            <p className="text-sm text-blue-700">
                                Keep your account secure by using a strong password and updating it regularly. Never share your password with anyone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailProfile;
