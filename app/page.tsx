'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAccount, login } from 'app/lib/actions'; // Import your actions

export default function Page() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState<'create' | 'login' | null>(null);
    const [accountType, setAccountType] = useState('student');
    const [message, setMessage] = useState('');
    const [loginAccountType, setLoginAccountType] = useState('student');

    const handleOpenPopup = (action: 'create' | 'login') => {
        setShowPopup(action);
        setMessage('');
        if (action === 'login') {
            setLoginAccountType('student');
        }
    };

    const handleClosePopup = () => {
        setShowPopup(null);
        setAccountType('student');
        setLoginAccountType('student');
    };

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullname = (e.currentTarget.elements.namedItem('fullname') as HTMLInputElement).value;
        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
        const classes = [];

        const result = await createAccount(
            crypto.randomUUID(),
            fullname,
            email,
            password,
            classes,
            '0.0',
            '0.0',
            false,
            accountType
        );

        if (result.success) {
            setMessage('Your account has been created, now please log in.');
            handleClosePopup();
        } else {
            setMessage(result.message || 'Account creation failed.');
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        try {
            const result = await login(email, password, loginAccountType);

            if (result.success) {
                // Store email in localStorage
                localStorage.setItem('email', email);

                // Redirect to dashboard based on role
                if (result.role === 'student') {
                    router.push('/student/dashboard');
                } else if (result.role === 'teacher') {
                    router.push('/teacher/dashboard');
                }
            } else {
                setMessage(result.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
                <AcmeLogo />
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                    <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
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

            {message && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <p className="text-green-600">{message}</p>
                        <button onClick={() => setMessage('')} className="mt-4 text-blue-500">Close</button>
                    </div>
                </div>
            )}

            {showPopup === 'create' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-xl mb-4">Create an Account</h2>
                        <form onSubmit={handleCreateAccount}>
                            <input type="text" name="fullname" placeholder="Full Name" className="border p-2 w-full mb-2" required />
                            <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-2" required />
                            <input type="password" name="password" placeholder="Password" className="border p-2 w-full mb-2" required />
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

            {showPopup === 'login' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-xl mb-4">Log In</h2>
                        <form onSubmit={handleLogin}>
                            <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-2"
                                   required/>
                            <input type="password" name="password" placeholder="Password"
                                   className="border p-2 w-full mb-4" required/>
                            <label htmlFor="loginAccountType" className="block mb-2">I am a:</label>
                            <select
                                id="loginAccountType"
                                value={loginAccountType}
                                onChange={(e) => setLoginAccountType(e.target.value)}
                                className="border p-2 w-full mb-4"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Log In</button>
                        </form>
                        <button onClick={handleClosePopup} className="mt-4 text-blue-500">Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}