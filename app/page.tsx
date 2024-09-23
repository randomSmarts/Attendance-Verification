'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
    const [showPopup, setShowPopup] = useState(null); // Track which popup to show
    const [accountType, setAccountType] = useState('student'); // Track account type
    const [message, setMessage] = useState(''); // Message state for account creation

    const handleOpenPopup = (action) => {
        setShowPopup(action);
        setMessage(''); // Clear message when opening popup
    };

    const handleClosePopup = () => {
        setShowPopup(null);
        setAccountType('student'); // Reset account type
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        // Here you would normally handle account creation (e.g., API call)

        // Simulate account creation success
        setMessage('Your account has been created, now please log in.');
        handleClosePopup(); // Close the popup after creation
    };

    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
                <AcmeLogo />
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                    <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black" />
                    <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                        <strong>Welcome to VETA.</strong> Built for attendance verification and tracking for schools,{' '}
                        <a href="https://nextjs.org/learn/" className="text-blue-500">
                            by someone in school
                        </a>. Brought to you by randomSmarts.
                    </p>
                    <button
                        onClick={() => handleOpenPopup('create')}
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        Create an Account
                    </button>
                    <button
                        onClick={() => handleOpenPopup('login')}
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        Log In
                    </button>
                </div>
            </div>

            {/* Popup Notification after account creation */}
            {message && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <p className="text-green-600">{message}</p>
                        <button onClick={() => setMessage('')} className="mt-4 text-blue-500">Close</button>
                    </div>
                </div>
            )}

            {/* Popup for Create Account */}
            {showPopup === 'create' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-xl mb-4">Create an Account</h2>
                        {/* Form for creating an account */}
                        <form onSubmit={handleCreateAccount}>
                            <input type="text" placeholder="Username" className="border p-2 w-full mb-2" required />
                            <input type="email" placeholder="Email" className="border p-2 w-full mb-2" required />
                            <input type="password" placeholder="Password" className="border p-2 w-full mb-2" required />

                            <label htmlFor="accountType" className="block mb-2">I am a:</label>
                            <select
                                id="accountType"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="border p-2 w-full mb-4"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>

                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Submit</button>
                        </form>
                        <button onClick={handleClosePopup} className="mt-4 text-blue-500">Close</button>
                    </div>
                </div>
            )}

            {/* Popup for Login */}
            {showPopup === 'login' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-xl mb-4">Log In</h2>
                        {/* Form for logging in */}
                        <form>
                            <input type="email" placeholder="Email" className="border p-2 w-full mb-2" required />
                            <input type="password" placeholder="Password" className="border p-2 w-full mb-4" required />
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Log In</button>
                        </form>
                        <button onClick={handleClosePopup} className="mt-4 text-blue-500">Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}
