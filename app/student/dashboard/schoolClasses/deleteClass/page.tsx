'use client';

import React, { useEffect, useState } from 'react';
import { leaveClassByCode } from 'app/lib/actions'; // Import the leaveClassByCode function

const LeaveClassPage = () => {
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Retrieve email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
        } else {
            setEmail(storedEmail);
        }
    }, []);

    const handleLeaveClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // Validate inputs
        if (!classCode.trim()) {
            setMessage('Error: Class code cannot be empty.');
            setLoading(false);
            return;
        }

        if (!email) {
            setMessage('Error: Unable to retrieve your email. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const response = await leaveClassByCode(email, classCode);

            if (response.success) {
                setMessage(`Success: ${response.message}`);
            } else {
                setMessage(`Error: ${response.message || 'Failed to leave the class. Please try again.'}`);
            }
        } catch (error) {
            console.error('Error leaving class:', error);
            setMessage('Error: An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
            setClassCode(''); // Clear the class code field
        }
    };

    return (
        <div className="container mx-auto max-w-md p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Leave a Class</h1>

            {message && (
                <p
                    className={`text-center font-medium mb-4 ${
                        message.startsWith('Success') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={handleLeaveClass} className="space-y-4">
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
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-400 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Leave Class'}
                </button>
            </form>
        </div>
    );
};

export default LeaveClassPage;