'use client';

import React, { useEffect, useState } from 'react';
import { getUserInfoByEmail } from 'app/lib/actions'; // Import the function to fetch user info

// Define the structure of the expected user info
interface UserInfo {
    name: string;
    email: string;
    role: string;
    classes: {
        id: string;
        name: string;
        timings: { day: string; startTime: string; endTime: string }[];
    }[];
}

export default function ViewUserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    // Retrieve email from localStorage and fetch user info
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setError('Error: Unable to retrieve your email. Please log in again.');
            return;
        }
        setEmail(storedEmail);
        fetchUserInfo(storedEmail);
    }, []);

    const fetchUserInfo = async (userEmail: string) => {
        setLoading(true);
        setError(null);

        try {
            // @ts-ignore
            const data: UserInfo = await getUserInfoByEmail(userEmail);
            if (!data) {
                throw new Error('User not found');
            }
            setUserInfo(data);
        } catch (err: any) {
            console.error('Error fetching user info:', err);
            setError(err.message || 'An error occurred while fetching user info.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

            {loading && <p className="text-blue-500 text-center mb-4">Loading your profile...</p>}

            {error && (
                <p className="text-red-500 text-center mb-4">
                    {error}
                </p>
            )}

            {userInfo && (
                <div className="border p-6 rounded">
                    <h2 className="text-xl font-semibold mb-4">User Info</h2>
                    <p className="mb-2">
                        <strong>Name:</strong> {userInfo.name}
                    </p>
                    <p className="mb-2">
                        <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p className="mb-4">
                        <strong>Role:</strong> {userInfo.role}
                    </p>

                    <h3 className="text-lg font-semibold mb-2">Your Classes</h3>
                    {userInfo.classes.length > 0 ? (
                        <div
                            className={`grid gap-6 ${
                                userInfo.classes.length === 1
                                    ? 'grid-cols-1'
                                    : userInfo.classes.length === 2
                                        ? 'grid-cols-1 sm:grid-cols-2'
                                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}
                        >
                            {userInfo.classes.map((cls) => (
                                <div key={cls.id} className="p-4 bg-gray-100 border rounded-lg shadow">
                                    <h4 className="text-lg font-semibold">{cls.name}</h4>
                                    <ul className="text-sm text-gray-800 mt-2 list-disc list-inside">
                                        {Array.isArray(cls.timings) && cls.timings.length > 0 ? (
                                            cls.timings.map((timing, index) => (
                                                <li key={index}>
                                                    <strong>{timing.day}</strong>: {timing.startTime} - {timing.endTime}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No timings available</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No classes found for your account.</p>
                    )}
                </div>
            )}
        </div>
    );
}