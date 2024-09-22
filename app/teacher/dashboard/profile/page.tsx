'use client';

import React, { useState } from 'react';
import { getUserInfoByEmail } from 'app/lib/actions';

export default function ViewUserInfo() {
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await getUserInfoByEmail(email);
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
                <label htmlFor="email" className="block mb-2 font-medium">Enter User Email:</label>
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
                    <p><strong>Name:</strong> {userInfo.name}</p> {/* Keep as name */}
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Role:</strong> {userInfo.role}</p>

                    <h3 className="text-lg font-semibold mt-4">Enrolled Classes:</h3>
                    <ul className="list-disc ml-5">
                        {userInfo.classes.map((cls: any) => (
                            <li key={cls.id}>
                                {cls.name} - {cls.timings}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
