'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfoByEmail, fetchClassesForUserByEmail } from 'app/lib/actions'; // Ensure correct import paths

export default function StudentDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedEmail = localStorage.getItem('email');
                if (!storedEmail) {
                    setError('Unable to retrieve your email. Please log in again.');
                    setLoading(false);
                    return;
                }

                setEmail(storedEmail);

                // Fetch user information
                const user = await getUserInfoByEmail(storedEmail);
                setUserInfo(user);

                // Fetch student's classes
                const userClasses = await fetchClassesForUserByEmail(storedEmail);
                setClasses(userClasses);

                setError(null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError('Failed to load your dashboard. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold">Welcome, {userInfo?.name || 'Student'}!</h1>
                <p className="text-lg mt-2">Keep track of your attendance and academic progress.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Attendance Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Attendance</h2>
                    <p className="text-gray-700 mb-4">
                        Track your attendance and ensure you're present for all your classes.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Today's Status:</span>
                        <span className={`text-sm font-bold ${userInfo?.present ? 'text-green-600' : 'text-red-600'}`}>
                            {userInfo?.present ? 'Present' : 'Absent'}
                        </span>
                    </div>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/attendance')}
                    >
                        View Attendance
                    </button>
                </section>

                {/* School Classes Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">School Classes</h2>
                    <p className="text-gray-700 mb-4">
                        Access your class schedule and stay on top of your responsibilities.
                    </p>
                    {classes.length > 0 ? (
                        <ul className="text-gray-700 list-disc pl-4 mb-4">
                            {classes.map((cls) => (
                                <li key={cls.id}>
                                    <strong>{cls.name}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">You’re not enrolled in any classes yet.</p>
                    )}
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/schoolClasses/viewClasses')}
                    >
                        Manage Classes
                    </button>
                </section>

                {/* Profile Panel */}
                <section className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Profile</h2>
                    <p className="text-gray-700 mb-4">
                        Update your personal details to ensure your profile is up-to-date.
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src="https://via.placeholder.com/50"
                            alt="Profile Avatar"
                            className="w-12 h-12 rounded-full border"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-800">{userInfo?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{userInfo?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 transition"
                        onClick={() => router.push('./dashboard/profile')}
                    >
                        Edit Profile
                    </button>
                </section>
            </div>

            {/* Additional Features Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Coming Soon</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Notifications */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Notifications</h3>
                        <p className="text-gray-700 mb-4">
                            Stay informed about important updates and announcements.
                        </p>
                        <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    {/* Support */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Need Help?</h3>
                        <p className="text-gray-700 mb-4">
                            Facing issues or have questions? Contact the support team for assistance.
                        </p>
                        <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}