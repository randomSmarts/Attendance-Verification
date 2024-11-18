'use client';

import React, { useState, useEffect } from 'react';
import { joinClassByCode } from 'app/lib/actions'; // Import the joinClassByCode function

const JoinClassPage = () => {
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    // Retrieve email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
        } else {
            setEmail(storedEmail);
        }
    }, []);

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await joinClassByCode(email, classCode);

            if (response.success) {
                setMessage(`Success: ${response.message}`);
            } else {
                setMessage(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error('Error joining class:', error);
            setMessage('An unexpected error occurred. Please try again.');
        }

        // Clear the class code field
        setClassCode('');
    };

    return (
        <div className="container mx-auto max-w-md p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Join a Class</h1>

            {message && (
                <p
                    className={`text-center font-medium mb-4 ${
                        message.startsWith('Success') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={handleJoinClass} className="space-y-4">
                <div>
                    <label htmlFor="classCode" className="block font-medium mb-2">
                        Class Code:
                    </label>
                    <input
                        type="text"
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter class code"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
                >
                    Join Class
                </button>
            </form>
        </div>
    );
};

export default JoinClassPage;