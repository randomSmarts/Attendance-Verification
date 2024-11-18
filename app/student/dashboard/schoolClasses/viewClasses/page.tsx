'use client';

import React, { useEffect, useState } from 'react';
import { getUserClassesByEmail } from 'app/lib/actions'; // Ensure this points to your modified function

const UserClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    // Retrieve email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
        } else {
            setEmail(storedEmail);
            fetchClasses(storedEmail); // Fetch classes as soon as the email is retrieved
        }
    }, []);

    const fetchClasses = async (userEmail: string) => {
        setLoading(true);
        setMessage('');
        try {
            const result = await getUserClassesByEmail(userEmail);
            if (result.length === 0) {
                setMessage('No classes found for your account.');
                setClasses([]);
            } else {
                setClasses(result);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Your Classes</h1>

            {loading && <p className="text-blue-500 text-center mb-4">Loading your classes...</p>}

            {message && (
                <p
                    className={`text-center font-medium mb-4 ${
                        message.startsWith('Error') ? 'text-red-500' : 'text-green-500'
                    }`}
                >
                    {message}
                </p>
            )}

            {classes.length > 0 && (
                <div
                    className={`grid gap-6 ${
                        classes.length === 1
                            ? 'grid-cols-1'
                            : classes.length === 2
                                ? 'grid-cols-1 sm:grid-cols-2'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {classes.map((cls) => (
                        <div key={cls.id} className="p-4 bg-gray-100 border rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{cls.name}</h2>
                            <p className="text-sm text-gray-600 mt-2">Timings:</p>
                            <ul className="text-sm text-gray-800 mt-1 list-disc list-inside">
                                {Array.isArray(cls.timings) && cls.timings.length > 0 ? (
                                    cls.timings.map((timing, index) => (
                                        <li key={index}>
                                            <strong>{timing.day}</strong>: {timing.startTime} - {timing.endTime}
                                        </li>
                                    ))
                                ) : (
                                    <li>No timings available.</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserClassesPage;