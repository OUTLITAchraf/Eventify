import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../features/auth/authSlice'; // Assuming this is the correct path

function DetailProfile() {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const role = user?.roles?.[0]?.name || "User";

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await dispatch(fetchUser(token)).unwrap();
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            }
        };

        fetchUserData();
    }, [dispatch]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    My Profile
                </h1>

                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <h2 className="text-sm text-gray-500 uppercase">Full Name</h2>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{user.name}</p>
                    </div>

                    <div className="border-b pb-4">
                        <h2 className="text-sm text-gray-500 uppercase">Email Address</h2>
                        <p className="text-lg font-semibold text-gray-800 mt-1">{user.email}</p>
                    </div>

                    {user.role && (
                        <div className="border-b pb-4">
                            <h2 className="text-sm text-gray-500 uppercase">Role</h2>
                            <p className="text-lg font-semibold text-gray-800 mt-1">
                                {user.role}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailProfile
