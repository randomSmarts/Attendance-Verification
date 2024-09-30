'use client';

import React, { useState } from 'react';
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
    const [email, setEmail] = useState<string>('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data: UserInfo = await getUserInfoByEmail(email);
            if (!data) {
                throw new Error('User not found');
            }
            setUserInfo(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">View User Information</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <label htmlFor="email" className="block mb-2 font-medium">
                    Enter User Email:
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-4"
                    placeholder="user@example.com"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch User Info'}
                </button>
            </form>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {userInfo && (
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">User Info</h2>
                    <p>
                        <strong>Name:</strong> {userInfo.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {userInfo.role}
                    </p>

                    <h3 className="text-lg font-semibold mt-4">Enrolled Classes:</h3>
                    <ul className="list-disc ml-5">
                        {userInfo.classes.map((cls) => (
                            <li key={cls.id}>
                                <strong>{cls.name}</strong>
                                <ul className="list-disc ml-5">
                                    {/* Display timings properly */}
                                    {Array.isArray(cls.timings) && cls.timings.length > 0 ? (
                                        cls.timings.map((timing, index) => (
                                            <li key={index}>
                                                {timing.day}: {timing.startTime} - {timing.endTime}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No timings available</li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
