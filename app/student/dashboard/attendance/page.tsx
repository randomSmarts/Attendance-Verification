'use client';

import React, { useState } from 'react';
import AttendanceButton from 'app/ui/attendance/button';
import { getUserClassesByEmail2 } from 'app/lib/actions'; // Fetch classes by email

const Page = () => {
    const [email, setEmail] = useState('');
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const fetchedClasses = await getUserClassesByEmail2(email); // Fetch classes
            setClasses(fetchedClasses); // Set classes in state
            if (fetchedClasses.length === 0) {
                setMessage('No classes found for this email.');
            } else {
                setMessage('');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            setMessage('Failed to fetch classes.');
        }
    };

    return (
        <div>
            <h1>Attendance</h1>
            <form onSubmit={handleEmailSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Get Classes</button>
            </form>
            {message && <p>{message}</p>}
            {classes.length > 0 && (
                <AttendanceButton classes={classes} email={email} /> // Pass classes to AttendanceButton
            )}
        </div>
    );
};

export default Page;
